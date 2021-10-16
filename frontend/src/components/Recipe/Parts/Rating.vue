<template>
  <div @click.prevent>
    <v-rating
      :readonly="!loggedIn"
      color="secondary"
      background-color="secondary lighten-3"
      length="5"
      :dense="small ? true : undefined"
      :size="small ? 15 : undefined"
      hover
      v-model="rating"
      :value="rating"
      @input="updateRating"
      @click="updateRating"
    ></v-rating>
  </div>
</template>

<script>
import { api } from "@/api";
import {user} from "@/mixins/user";
export default {
  mixins: [ user ],
  props: {
    id: Number,
    name: String,
    slug: String,
    ratings: Array,
    small: {
      default: false,
    },
  },
  async mounted() {
    const [response, error] = await api.recipes.requestDetails(this.slug);

    if (error) console.log({ error });
    const recipe = response.data;

    this.updatedRatings = JSON.parse(recipe.ratings);
    this.rating = this.loggedIn ? this.getMyRating() : 0;

    this.$root.$on(`updateRatings-${this.id}`, data => {
      this.updatedRatings = data;
      this.rating = this.getMyRating();
    })
  },
  data() {
    return {
      rating: 0,
      updatedRatings: this.ratings,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.getIsLoggedIn;
    },
  },
  methods: {
    getMyRating() {

      if (!this.updatedRatings || !this.updatedRatings.length) {
        return 0;
      }

      const myRating = this.updatedRatings.find((rating => rating.userId === this.user.id))
      return myRating?.rating;
    },
    async updateRating(val) {
      const [response, error] = await api.recipes.requestDetails(this.slug);
      if (error) console.log({ error });
      const recipe = response.data;

      const updatedRatings = recipe?.ratings ? JSON.parse(recipe.ratings) : [];

      const myUserId = this.$store.getters.getUserData.id;
      const myRatingIndex = updatedRatings.findIndex((rating => rating.userId === myUserId))

      if (myRatingIndex >= 0) {
        updatedRatings[myRatingIndex].rating = val;
      } else {
        updatedRatings.push({
          userId: myUserId,
          rating: val,
        });
      }

      api.recipes.patch({
        name: this.name,
        slug: this.slug,
        ratings: JSON.stringify(updatedRatings),
      });

      this.$root.$emit(`updateRatings-${this.id}`, updatedRatings);
    },
  },
};
</script>

<style lang="scss" scoped></style>
