<template>
  <div class="avgRating secondary--text mr-2" :class="containerClass">
    <v-rating
      :readonly="true"
      color="secondary"
      background-color="secondary lighten-3"
      length="1"
      :dense="small ? true : undefined"
      :size="small ? 15 : undefined"
      :value="1"
    ></v-rating>
    {{ this.avgRating }}
  </div>
</template>

<script>
import {api} from "@/api";
import {utils} from "@/utils";

export default {
  props: {
    id: Number,
    slug: String,
    ratings: Array,
    small: {
      default: false,
    },
    card: {
      default: false,
    },
  },
  async mounted() {
    const [response, error] = await api.recipes.requestDetails(this.slug);
    if (error) console.log({ error });
    const recipe = response.data;

    this.updatedRatings = JSON.parse(recipe.ratings);

    this.$root.$on(`updateRatings-${this.id}`, data => {
      this.updatedRatings = data;
    })
  },
  data() {
    return {
      updatedRatings: this.ratings,
    };
  },
  computed: {
    containerClass() {
      if (this.small) {
        return 'avgRating--small';
      }
      if (this.card) {
        return 'avgRating--card';
      }

      return '';
    },
    avgRating() {
      return this.getMeanValue();
    },
  },
  methods: {
    getMeanValue() {
      return utils.recipe.getAverageRating(this.updatedRatings);
    },
  },
};
</script>

<style>
  .avgRating {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .avgRating button[class] {
    padding-right: .25rem;
    padding-top: .25rem;
  }

  .avgRating--card {
    width: 3.5rem;
  }

  .avgRating--small {
    font-size: 0.8rem;
  }
</style>
