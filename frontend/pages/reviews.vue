<script setup lang="ts">
import type {
  CreateReviewPayload,
  PublicReviews,
  PublicReviewsQuery,
  ReviewSort,
} from "~/composables/useApi";

definePageMeta({
  path: "/otzyvy",
});

const starOptions = [1, 2, 3, 4, 5];
const ratingSourceUrl = "https://pilorama-razbegaevo.clients.site/#rating";
const { listPublicReviews, createReview } = useReviewsApi();
const fallbackReviewTextLimit = 1000;
const fallbackRatingOptions = [5, 4, 3, 2, 1];

const selectedRatingFilter = ref<number | null>(null);
const reviewSort = ref<ReviewSort>("newest");
const publicReviewsQuery = computed<PublicReviewsQuery>(() => ({
  rating: selectedRatingFilter.value ?? undefined,
  sort: reviewSort.value,
}));

const form = reactive<CreateReviewPayload>({
  authorName: "",
  text: "",
  rating: 5,
});

// Отзывы загружаются на этапе генерации (SSG) и попадают в статический HTML,
// чтобы поисковые роботы видели их без выполнения JavaScript. Для этого backend
// должен быть доступен по `NUXT_PUBLIC_API_BASE` в момент `npm run generate`.
const {
  data: publicReviews,
  status: reviewsStatus,
  error: reviewsError,
  refresh: refreshReviews,
} = await useAsyncData<PublicReviews>(
  "public-reviews",
  () => listPublicReviews(publicReviewsQuery.value),
  {
    default: emptyPublicReviews,
  },
);

const reviews = computed(() => publicReviews.value.reviews);
const reviewSummary = computed(() => publicReviews.value.summary);
const ratingOptions = computed(() => publicReviews.value.ratingOptions);
const ratingBars = computed(() => reviewSummary.value.ratingBars);
const reviewTextLimit = computed(() => publicReviews.value.reviewTextLimit);

const isLoading = computed(() => reviewsStatus.value === "pending");
const hasLoaded = computed(
  () => !reviewsError.value && reviewsStatus.value !== "idle",
);
const isSubmitting = ref(false);
const feedback = reactive<{
  type: "success" | "error" | "";
  message: string;
}>({
  type: "",
  message: "",
});

const canSubmitReview = computed(
  () =>
    Boolean(form.authorName.trim()) &&
    Boolean(form.text.trim()) &&
    ratingOptions.value.includes(form.rating),
);
const reviewTextLength = computed(() => form.text.length);

useSeoMeta({
  title: "Отзывы о пилораме в Разбегаево",
  description:
    "Отзывы покупателей о пилораме в Разбегаево и форма для публикации опыта покупки, самовывоза или доставки пиломатериалов.",
  ogTitle: "Отзывы о пилораме в Разбегаево",
  ogDescription:
    "Отзывы покупателей о материале, обслуживании, самовывозе и доставке.",
  ogType: "website",
});

useHead({
  htmlAttrs: { lang: "ru" },
  link: [{ rel: "canonical", href: `${siteUrl}/otzyvy` }],
});

useSchemaOrg([
  defineWebPage({
    name: "Отзывы о пилораме в Разбегаево",
    description:
      "Отзывы покупателей о пиломатериалах и обслуживании на производственной площадке.",
  }),
]);

// Если во время генерации backend был недоступен, пробуем догрузить на клиенте.
onMounted(() => {
  if (reviewsError.value) {
    loadReviews();
  }
});

function emptyPublicReviews(): PublicReviews {
  return {
    reviews: [],
    summary: {
      totalCount: 0,
      averageRating: null,
      ratingBars: fallbackRatingOptions.map((rating) => ({
        rating,
        count: 0,
        percent: 0,
      })),
    },
    ratingOptions: fallbackRatingOptions,
    reviewTextLimit: fallbackReviewTextLimit,
    selectedRating: null,
    sort: "newest",
  };
}

async function loadReviews() {
  await refreshReviews();

  if (reviewsError.value) {
    setFeedback(
      "error",
      "Отзывы из базы сейчас недоступны, попробуйте обновить страницу позднее.",
    );
  } else {
    clearFeedback();
  }
}

async function submitReview() {
  if (!canSubmitReview.value) {
    setFeedback("error", "Заполните имя, текст и выберите оценку.");
    return;
  }

  isSubmitting.value = true;

  try {
    await createReview({
      authorName: form.authorName,
      text: form.text,
      rating: form.rating,
    });
    selectedRatingFilter.value = null;
    reviewsError.value = null;
    resetForm();
    await refreshReviews();
    setFeedback("success", "Спасибо, ваш отзыв успешно добавлен на страницу.");
  } catch {
    setFeedback(
      "error",
      "Отзыв сейчас не отправился, попробуйте повторить позднее.",
    );
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.authorName = "";
  form.text = "";
  form.rating = 5;
}

function setFeedback(type: "success" | "error", message: string) {
  feedback.type = type;
  feedback.message = message;
}

function clearFeedback() {
  feedback.type = "";
  feedback.message = "";
}

async function setRatingFilter(value: number | null) {
  selectedRatingFilter.value = value;
  await loadReviews();
}

function reviewInitial(authorName: string) {
  return authorName.trim().slice(0, 1).toLocaleUpperCase("ru-RU") || "?";
}

function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Дата публикации этого отзыва пока не указана";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function ratingLabel(value: number) {
  return `Оценка ${value} из 5`;
}
</script>

<template>
  <main>
    <section class="border-b border-[#171916] bg-[#f5f2eb]">
      <div
        class="mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] max-[900px]:grid-cols-1"
      >
        <div
          class="flex min-h-[350px] min-w-0 flex-col justify-center px-12 py-12 max-[840px]:min-h-0 max-[560px]:px-[18px] max-[560px]:py-9"
        >
          <h1
            class="mb-5 max-w-[760px] !text-[clamp(2.35rem,4.2vw,4.4rem)] !leading-[1.02]"
          >
            Отзывы о пилораме в Разбегаево
          </h1>
          <p
            class="mb-0 max-w-[650px] text-[clamp(1.03rem,1.25vw,1.18rem)] leading-[1.65] text-[#393d37]"
          >
            На Яндекс Картах указаны рейтинг 4,6 из 5 и 12 отзывов.
            <a
              class="ml-1 inline-flex w-max cursor-pointer border-0 border-b-2 border-current bg-transparent px-0 pb-[3px] font-[Segoe_UI,Arial,sans-serif] font-[760] text-[#1f3a2f] no-underline transition-colors duration-150 hover:text-[#d65a1f] disabled:cursor-not-allowed disabled:opacity-50"
              :href="ratingSourceUrl"
              target="_blank"
              rel="noopener"
            >
              Источник рейтинга
            </a>
          </p>

          <dl
            class="mt-8 grid max-w-[560px] grid-cols-3 border-y border-[#aaa69b] font-[Segoe_UI,Arial,sans-serif] max-[560px]:grid-cols-1"
          >
            <div
              class="border-r border-[#aaa69b] px-4 py-4 max-[560px]:border-b max-[560px]:border-r-0"
            >
              <dt class="mb-2 text-[0.8125rem] font-[760] uppercase leading-[1.35]">
                Яндекс Карты
              </dt>
              <dd class="m-0 text-[2rem] font-[760] leading-none text-[#1f3a2f]">
                4,6
              </dd>
            </div>
            <div
              class="border-r border-[#aaa69b] px-4 py-4 max-[560px]:border-b max-[560px]:border-r-0"
            >
              <dt class="mb-2 text-[0.8125rem] font-[760] uppercase leading-[1.35]">
                Отзывы
              </dt>
              <dd class="m-0 text-[2rem] font-[760] leading-none text-[#1f3a2f]">
                12
              </dd>
            </div>
            <div class="px-4 py-4">
              <dt class="mb-2 text-[0.8125rem] font-[760] uppercase leading-[1.35]">
                На сайте
              </dt>
              <dd class="m-0 text-[2rem] font-[760] leading-none text-[#1f3a2f]">
                {{ reviewSummary.totalCount }}
              </dd>
            </div>
          </dl>

        </div>

        <figure
          class="relative min-h-[350px] overflow-hidden border-l border-[#171916] bg-[#13251e] max-[900px]:min-h-[320px] max-[900px]:border-l-0 max-[900px]:border-t max-[560px]:min-h-[280px] [&_figcaption]:absolute [&_figcaption]:inset-x-0 [&_figcaption]:bottom-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover"
        >
          <NuxtImg
            src="/images/shtabel-suhoi-doski.jpg"
            alt="Штабели сухой доски в пачках на складе пилорамы"
            width="960"
            height="1280"
            sizes="xs:100vw sm:100vw md:42vw lg:42vw"
            densities="1"
            format="webp"
            loading="eager"
            preload
          />
          <figcaption>
            <span>Склад сухой доски</span>
            <span>Разбегаево</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section
      class="mx-auto grid w-[min(1280px,100%)] grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)] gap-8 px-8 py-14 max-[980px]:grid-cols-1 max-[560px]:px-[18px] max-[560px]:py-10"
    >
      <section class="min-w-0" aria-labelledby="reviews-list-title">
        <header
          class="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-b border-[#171916] pb-6 max-[560px]:grid-cols-1"
        >
          <div>
            <h2
              id="reviews-list-title"
              class="mb-0 !text-[clamp(1.7rem,2.2vw,2.55rem)] !leading-[1.1]"
            >
              Отзывы посетителей сайта
            </h2>
          </div>
          <button
            class="inline-flex min-h-11 cursor-pointer items-center justify-center border border-[#171916] bg-transparent px-4 py-2.5 text-center font-[Segoe_UI,Arial,sans-serif] text-[0.95rem] font-[760] leading-[1.1] no-underline transition-colors duration-150 hover:bg-[#171916] hover:text-[#fffdf7] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="isLoading"
            @click="loadReviews"
          >
            {{ isLoading ? "Обновляем данные" : "Обновить отзывы" }}
          </button>
        </header>

        <p
          v-if="feedback.message"
          class="mb-5 mt-0 border px-4 py-3.5 leading-[1.55]"
          :class="
            feedback.type === 'success'
              ? 'border-[#1f3a2f] bg-[#dfe8df] text-[#13251e]'
              : 'border-[#a53e10] bg-[#f4d9ca] text-[#6a290d]'
          "
          role="status"
        >
          {{ feedback.message }}
        </p>

        <p
          v-if="isLoading"
          class="mb-5 mt-0 border border-[#aaa69b] bg-[#f5f2eb] px-4 py-3.5 leading-[1.55]"
        >
          Загружаем отзывы.
        </p>

        <p
          v-else-if="hasLoaded && !reviewSummary.totalCount"
          class="mb-5 mt-0 border border-[#aaa69b] bg-[#f5f2eb] px-4 py-3.5 leading-[1.55]"
        >
          Опубликованных отзывов пока нет.
        </p>

        <p
          v-else-if="!hasLoaded"
          class="mb-5 mt-0 border border-[#aaa69b] bg-[#f5f2eb] px-4 py-3.5 leading-[1.55]"
        >
          Отзывы сейчас недоступны.
        </p>

        <template v-else>
          <div
            class="mb-5 grid grid-cols-[minmax(0,1fr)_minmax(190px,auto)] gap-4 border border-[#aaa69b] bg-[#f5f2eb] p-4 max-[700px]:grid-cols-1"
          >
            <div class="flex flex-wrap gap-2" aria-label="Фильтр отзывов по оценке">
              <button
                class="min-h-10 border px-3 py-2 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[760] transition-colors duration-150"
                :class="
                  selectedRatingFilter === null
                    ? 'border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7]'
                    : 'border-[#aaa69b] bg-[#fffdf7] hover:border-[#171916]'
                "
                type="button"
                @click="setRatingFilter(null)"
              >
                Все
              </button>
              <button
                v-for="bar in ratingBars"
                :key="bar.rating"
                class="min-h-10 border px-3 py-2 font-[Segoe_UI,Arial,sans-serif] text-[0.9rem] font-[760] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45"
                :class="
                  selectedRatingFilter === bar.rating
                    ? 'border-[#1f3a2f] bg-[#1f3a2f] text-[#fffdf7]'
                    : 'border-[#aaa69b] bg-[#fffdf7] hover:border-[#171916]'
                "
                type="button"
                :disabled="bar.count === 0"
                @click="setRatingFilter(bar.rating)"
              >
                {{ bar.rating }} ★ · {{ bar.count }}
              </button>
            </div>

            <label
              class="grid gap-2 justify-self-end font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-bold uppercase leading-[1.35] max-[700px]:justify-self-stretch"
            >
              <span>Порядок</span>
              <select
                v-model="reviewSort"
                class="min-h-10 border border-[#171916] bg-[#fffdf7] px-3 py-2 text-[0.95rem] normal-case text-[#171916]"
                @change="loadReviews"
              >
                <option value="newest">Сначала новые</option>
                <option value="highest">Сначала высокая оценка</option>
                <option value="lowest">Сначала низкая оценка</option>
              </select>
            </label>
          </div>

          <p
            v-if="!reviews.length"
            class="mb-5 mt-0 border border-[#aaa69b] bg-[#f5f2eb] px-4 py-3.5 leading-[1.55]"
          >
            По выбранной оценке отзывов нет.
          </p>

          <div v-else class="grid gap-4">
            <article
              v-for="review in reviews"
              :key="review.id"
              class="border border-[#aaa69b] bg-[#f5f2eb] p-6 shadow-[0_16px_34px_rgba(23,25,22,0.08)] transition-colors duration-150 hover:border-[#171916] max-[560px]:p-5 [&>p]:mb-0 [&>p]:text-[#393d37] [&>p]:leading-[1.68]"
            >
              <header
                class="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-5 max-[560px]:grid-cols-1"
              >
                <div class="flex min-w-0 items-start gap-3.5">
                  <span
                    class="grid size-11 shrink-0 place-items-center bg-[#1f3a2f] font-[Segoe_UI,Arial,sans-serif] text-[1.15rem] font-[760] uppercase leading-none text-[#fffdf7]"
                    aria-hidden="true"
                  >
                    {{ reviewInitial(review.authorName) }}
                  </span>
                  <div class="min-w-0">
                    <h3 class="mb-1 !text-[1.25rem] !leading-[1.18]">
                      {{ review.authorName }}
                    </h3>
                    <time
                      class="font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] leading-[1.4] text-[#5d5f58]"
                      :datetime="review.createdAt"
                    >
                      {{ formatDate(review.createdAt) }}
                    </time>
                  </div>
                </div>

                <div
                  class="flex gap-0.5 justify-self-end leading-none text-[#d65a1f] max-[560px]:justify-self-start"
                  :aria-label="ratingLabel(review.rating)"
                >
                  <span
                    v-for="rating in starOptions"
                    :key="rating"
                    :class="rating > review.rating ? 'text-[#aaa69b]' : 'text-[#d65a1f]'"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                </div>
              </header>
              <p>{{ review.text }}</p>
            </article>
          </div>
        </template>
      </section>

      <aside class="min-w-0" aria-label="Форма отзыва и сводка">
        <div class="sticky top-[96px] space-y-6 max-[980px]:static">
          <section
            v-if="reviewSummary.totalCount"
            class="border border-[#171916] bg-[#d8d2c6] p-6 max-[560px]:p-5"
          >
          <p
            class="mb-4 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase leading-[1.4] tracking-[0.04em]"
          >
            Сводка базы
          </p>
          <div
            class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[clamp(3.7rem,7vw,6.5rem)] font-[760] leading-[0.85] text-[#1f3a2f]"
          >
            {{ reviewSummary.averageRating }}
          </div>
          <p class="mb-0 text-[#393d37]">
            {{ reviewSummary.totalCount }} отзывов опубликовано на сайте.
          </p>

          <div class="mt-6 grid gap-2.5" aria-label="Распределение оценок">
            <div
              v-for="bar in ratingBars"
              :key="bar.rating"
              class="grid grid-cols-[24px_minmax(0,1fr)_26px] items-center gap-2.5 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-semibold"
            >
              <span>{{ bar.rating }}</span>
              <div class="h-2 border border-[#171916] bg-[#f5f2eb]">
                <i
                  class="block h-full bg-[#d65a1f]"
                  :style="{ width: `${bar.percent}%` }"
                />
              </div>
              <strong>{{ bar.count }}</strong>
            </div>
          </div>
          </section>

          <section
            id="review-form"
            class="scroll-mt-28 border border-[#171916] bg-[#f5f2eb] p-6 max-[560px]:p-5"
          >
          <p
            class="mb-3 font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-[760] uppercase leading-[1.4] tracking-[0.04em]"
          >
            Новый отзыв
          </p>
          <h2 class="mb-3 !text-[clamp(1.45rem,2vw,2rem)] !leading-[1.12]">
            Расскажите о своей покупке
          </h2>
          <p class="mb-0 text-[#393d37]">
            Укажите материал и кратко опишите свой опыт покупки.
          </p>

          <form class="mt-6 grid gap-4" @submit.prevent="submitReview">
            <label class="grid gap-2 font-[Segoe_UI,Arial,sans-serif] font-bold">
              <span>Имя</span>
              <input
                v-model="form.authorName"
                class="min-h-12 w-full min-w-0 border border-[#171916] bg-[#fffdf7] px-3 py-[11px] text-[#171916] focus:border-[#d65a1f] focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-[#d65a1f]"
                name="authorName"
                maxlength="80"
                autocomplete="name"
                placeholder="Ваше имя"
              />
            </label>

            <label class="grid gap-2 font-[Segoe_UI,Arial,sans-serif] font-bold">
              <span class="flex items-center justify-between gap-3">
                <span>Отзыв</span>
                <span
                  class="font-[Segoe_UI,Arial,sans-serif] text-[0.8125rem] font-semibold leading-[1.35] text-[#5d5f58]"
                >
                  {{ reviewTextLength }}/{{ reviewTextLimit }}
                </span>
              </span>
              <textarea
                v-model="form.text"
                class="min-h-[128px] w-full min-w-0 resize-y border border-[#171916] bg-[#fffdf7] p-3 leading-[1.5] text-[#171916] focus:border-[#d65a1f] focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-[#d65a1f]"
                name="text"
                rows="6"
                :maxlength="reviewTextLimit"
                placeholder="Опишите материал, отгрузку или доставку"
              />
            </label>

            <fieldset class="m-0 border-0 p-0">
              <legend class="mb-2 font-[Segoe_UI,Arial,sans-serif] font-bold">
                Оценка
              </legend>
              <div class="grid grid-cols-5 gap-2">
                <label
                  v-for="rating in starOptions"
                  :key="rating"
                  class="relative grid min-h-[44px] cursor-pointer"
                  :class="
                    form.rating === rating
                      ? '[&>span]:border-[#d65a1f] [&>span]:bg-[#d65a1f] [&>span]:text-[#fffdf7]'
                      : ''
                  "
                >
                  <input
                    v-model.number="form.rating"
                    class="peer absolute size-px opacity-0"
                    type="radio"
                    name="rating"
                    :value="rating"
                    :aria-label="ratingLabel(rating)"
                  />
                  <span
                    class="grid h-full w-full place-items-center border border-[#171916] bg-[#fffdf7] font-[Segoe_UI,Arial,sans-serif] text-[0.95rem] font-[760] transition-colors duration-150 hover:border-[#d65a1f] hover:bg-[#d65a1f] hover:text-[#fffdf7] peer-focus:outline peer-focus:outline-[3px] peer-focus:outline-offset-2 peer-focus:outline-[#d65a1f]"
                  >
                    {{ rating }} ★
                  </span>
                </label>
              </div>
            </fieldset>

            <button
              class="inline-flex min-h-12 cursor-pointer items-center justify-center border border-[#d65a1f] bg-[#d65a1f] px-[18px] py-3 text-center font-[Segoe_UI,Arial,sans-serif] font-[760] leading-[1.1] text-[#fffdf7] no-underline transition-colors duration-150 hover:border-[#a53e10] hover:bg-[#a53e10] disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              :disabled="isSubmitting || !canSubmitReview"
            >
              {{ isSubmitting ? "Отправляем отзыв" : "Опубликовать отзыв" }}
            </button>
          </form>
          </section>
        </div>
      </aside>
    </section>
  </main>
</template>
