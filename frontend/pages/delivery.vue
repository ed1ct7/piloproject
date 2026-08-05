<script setup lang="ts">
definePageMeta({
  path: '/dostavka',
})

useSeoMeta({
  title: 'Доставка пиломатериалов – Разбегаево, Ломоносовский район, СПб',
  description: 'Самовывоз и согласование доставки пиломатериалов из Разбегаево по Ломоносовскому району, Ленинградской области и Санкт-Петербургу.',
  ogTitle: 'Доставка пиломатериалов из Разбегаево',
  ogDescription: 'Порядок самовывоза и согласования доставки доски, бруса и других пиломатериалов.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru' },
  link: [{ rel: 'canonical', href: `${siteUrl}/dostavka` }],
})

const deliverySteps = [
  {
    number: '01',
    title: 'Отправьте список',
    text: 'Напишите, какие материалы и в каком объёме нужны. Можно отправить готовую смету или фото списка.',
  },
  {
    number: '02',
    title: 'Укажите адрес',
    text: 'Рассчитаем подходящую машину, стоимость маршрута и согласуем удобный день доставки.',
  },
  {
    number: '03',
    title: 'Примите заказ',
    text: 'Подготовим и погрузим пиломатериалы. Перед выездом водитель свяжется с вами.',
  },
]
</script>

<template>
  <main class="delivery-page">
    <section class="delivery-hero" aria-labelledby="delivery-title">
      <div class="delivery-hero__content">
        <p class="eyebrow">Получение заказа</p>
        <h1 id="delivery-title">Доставка пиломатериалов и самовывоз</h1>
        <p class="delivery-hero__lead">
          Привезём заказ по Санкт-Петербургу и Ленинградской области или подготовим
          его к самовывозу с производства в Разбегаево.
        </p>

        <div class="delivery-actions">
          <a
            class="delivery-button delivery-button--primary"
            :href="businessWhatsAppUrl"
            target="_blank"
            rel="noopener"
          >Рассчитать доставку</a>
          <a class="delivery-button delivery-button--secondary" :href="businessPhoneHref">
            {{ businessPhone }}
          </a>
        </div>

        <dl class="delivery-facts" aria-label="Основные условия получения заказа">
          <div>
            <dt>География</dt>
            <dd>СПб и Ленобласть</dd>
          </div>
          <div>
            <dt>Оплата</dt>
            <dd>По факту отгрузки</dd>
          </div>
          <div>
            <dt>Самовывоз</dt>
            <dd>Разбегаево</dd>
          </div>
        </dl>
      </div>

      <figure class="delivery-hero__visual">
        <NuxtImg
          src="/images/dostavka-pilomaterialov.jpg"
          alt="Машина с пиломатериалами на доставке у участка заказчика"
          width="1200"
          height="1600"
          sizes="xs:100vw sm:100vw md:48vw lg:48vw xl:48vw"
          densities="1"
          format="webp"
          loading="eager"
          preload
          fetchpriority="high"
        />
        <div class="delivery-hero__badge" aria-hidden="true">
          <strong>От производства</strong>
          <span>прямо на ваш участок</span>
        </div>
        <figcaption class="delivery-hero__caption">
          <span>Доставка заказа</span>
          <span>Ленинградская область</span>
        </figcaption>
      </figure>
    </section>

    <section class="receiving" aria-labelledby="receiving-title">
      <header class="section-heading">
        <p class="eyebrow">Два варианта</p>
        <h2 id="receiving-title">Как получить заказ</h2>
        <p>
          Выберите удобный способ. В обоих случаях заранее согласуем состав заказа,
          дату готовности и все условия.
        </p>
      </header>

      <div class="receiving__options">
        <article class="receiving-card receiving-card--pickup">
          <div class="receiving-card__topline">
            <span class="receiving-card__number">01</span>
            <span class="receiving-card__label">Самовывоз</span>
          </div>
          <h3>Забрать в Разбегаево</h3>
          <p>
            Подготовим заказ к согласованному времени и поможем с погрузкой на
            производственной площадке.
          </p>
          <ul>
            <li>Сообщим, когда заказ готов</li>
            <li>Согласуем время приезда</li>
            <li>Погрузим материал в машину</li>
          </ul>
          <NuxtLink class="text-link" to="/kontakty">Адрес и контакты</NuxtLink>
        </article>

        <article class="receiving-card receiving-card--delivery">
          <div class="receiving-card__topline">
            <span class="receiving-card__number">02</span>
            <span class="receiving-card__label">Доставка</span>
          </div>
          <h3>Привезти на объект</h3>
          <p>
            Подберём транспорт под объём заказа и рассчитаем маршрут до вашего
            участка или строительного объекта.
          </p>
          <ul>
            <li>СПб и Ленинградская область</li>
            <li>Стоимость зависит от адреса и объёма</li>
            <li>Дату и время согласуем заранее</li>
          </ul>
          <a
            class="text-link"
            :href="businessWhatsAppUrl"
            target="_blank"
            rel="noopener"
          >Узнать стоимость</a>
        </article>
      </div>
    </section>

    <section class="delivery-process" aria-labelledby="process-title">
      <header class="delivery-process__heading">
        <p class="eyebrow eyebrow--light">Всё просто</p>
        <h2 id="process-title">Как оформить доставку</h2>
      </header>

      <ol class="delivery-process__list">
        <li v-for="step in deliverySteps" :key="step.number">
          <span>{{ step.number }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="delivery-cta" aria-labelledby="delivery-cta-title">
      <div>
        <p class="eyebrow">Расчёт без обязательств</p>
        <h2 id="delivery-cta-title">Скажите, куда везти — посчитаем стоимость</h2>
      </div>
      <div class="delivery-cta__contact">
        <p>
          Пришлите адрес, список материалов и желаемую дату. Ответим по наличию,
          срокам и доставке.
        </p>
        <a
          class="delivery-button delivery-button--primary"
          :href="businessWhatsAppUrl"
          target="_blank"
          rel="noopener"
        >Написать в WhatsApp</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.delivery-page {
  --ink: #171916;
  --forest: #1f3a2f;
  --paper: #f5f2eb;
  --sand: #e9e5dc;
  --line: #aaa69b;
  --orange: #d65a1f;
  background: var(--sand);
}

.eyebrow {
  margin-bottom: 1rem;
  color: var(--forest);
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  line-height: 1.4;
  text-transform: uppercase;
}

.delivery-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(400px, 0.92fr);
  min-height: 640px;
  margin: 0 auto;
  border-bottom: 1px solid var(--ink);
}

.delivery-hero__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 72px max(48px, calc((100vw - 1280px) / 2));
  padding-right: clamp(48px, 7vw, 120px);
}

.delivery-hero h1 {
  max-width: 760px;
  margin-bottom: 1.5rem;
  font-size: clamp(3rem, 4.45vw, 5.45rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  overflow-wrap: normal;
  word-break: normal;
}

.delivery-hero__lead {
  max-width: 660px;
  margin-bottom: 2rem;
  color: #393d37;
  font-size: clamp(1.04rem, 1.35vw, 1.25rem);
  line-height: 1.55;
}

.delivery-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.delivery-button {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink);
  padding: 0.85rem 1.3rem;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 0.94rem;
  font-weight: 760;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.delivery-button--primary {
  border-color: var(--orange);
  background: var(--orange);
  color: #fffdf7;
}

.delivery-button--primary:hover {
  border-color: #a53e10;
  background: #a53e10;
}

.delivery-button--secondary {
  background: transparent;
  color: var(--ink);
}

.delivery-button--secondary:hover {
  background: var(--ink);
  color: #fffdf7;
}

.delivery-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 700px;
  margin: 3rem 0 0;
  border-block: 1px solid var(--line);
}

.delivery-facts div {
  padding: 1rem 1.2rem;
  border-right: 1px solid var(--line);
}

.delivery-facts div:first-child {
  padding-left: 0;
}

.delivery-facts div:last-child {
  border-right: 0;
}

.delivery-facts dt {
  margin-bottom: 0.35rem;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.delivery-facts dd {
  margin: 0;
  color: #393d37;
  font-size: 0.93rem;
  line-height: 1.35;
}

.delivery-hero__visual {
  position: relative;
  min-width: 0;
  min-height: 640px;
  overflow: hidden;
  border-left: 1px solid var(--ink);
  background: #c9c1af;
}

.delivery-hero__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 44%;
}

.delivery-hero__badge {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: grid;
  min-width: 190px;
  padding: 1rem 1.1rem;
  background: var(--forest);
  color: #fffdf7;
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.25;
}

.delivery-hero__badge strong {
  font-size: 0.9rem;
  text-transform: uppercase;
}

.delivery-hero__badge span {
  margin-top: 0.25rem;
  color: #d8d2c6;
  font-size: 0.84rem;
}

.delivery-hero__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

.receiving {
  display: grid;
  grid-template-columns: minmax(300px, 0.76fr) minmax(0, 1.5fr);
  gap: clamp(48px, 7vw, 112px);
  padding: 96px max(24px, calc((100vw - 1280px) / 2));
  border-bottom: 1px solid var(--ink);
  background: var(--paper);
}

.section-heading {
  max-width: 440px;
}

.section-heading h2 {
  margin-bottom: 1.25rem;
}

.section-heading > p:last-child {
  max-width: 390px;
  margin-bottom: 0;
  color: #393d37;
  font-size: 1.04rem;
  line-height: 1.6;
}

.receiving__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border: 1px solid var(--ink);
}

.receiving-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: clamp(28px, 3vw, 44px);
}

.receiving-card + .receiving-card {
  border-left: 1px solid var(--ink);
}

.receiving-card--pickup {
  background: var(--sand);
}

.receiving-card--delivery {
  background: #dfe4da;
}

.receiving-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3.5rem;
  font-family: "Segoe UI", Arial, sans-serif;
}

.receiving-card__number {
  font-size: 0.84rem;
  font-weight: 800;
}

.receiving-card__label {
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--ink);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.receiving-card h3 {
  max-width: 300px;
  margin-bottom: 1rem;
  font-size: clamp(1.55rem, 2vw, 2.25rem);
}

.receiving-card > p {
  margin-bottom: 1.5rem;
  color: #393d37;
  line-height: 1.6;
}

.receiving-card ul {
  display: grid;
  gap: 0.55rem;
  margin: 0 0 2.4rem;
  padding: 0;
  list-style: none;
}

.receiving-card li {
  position: relative;
  padding-left: 1.35rem;
  color: #393d37;
  font-size: 0.94rem;
  line-height: 1.45;
}

.receiving-card li::before {
  position: absolute;
  top: 0.55rem;
  left: 0;
  width: 6px;
  height: 6px;
  background: var(--orange);
  content: "";
}

.text-link {
  width: max-content;
  margin-top: auto;
  border-bottom: 2px solid currentColor;
  padding-bottom: 0.2rem;
  color: var(--forest);
  font-family: "Segoe UI", Arial, sans-serif;
  font-weight: 760;
  text-decoration: none;
  transition: color 150ms ease;
}

.text-link:hover {
  color: var(--orange);
}

.delivery-process {
  display: grid;
  grid-template-columns: minmax(270px, 0.68fr) minmax(0, 1.32fr);
  background: var(--forest);
  color: #fffdf7;
}

.delivery-process__heading {
  padding: 80px max(48px, calc((100vw - 1280px) / 2));
  padding-right: clamp(40px, 6vw, 96px);
}

.eyebrow--light {
  color: #cbd3ca;
}

.delivery-process__heading h2 {
  max-width: 430px;
  margin-bottom: 0;
}

.delivery-process__list {
  margin: 0;
  padding: 0;
  border-left: 1px solid #68766e;
  list-style: none;
}

.delivery-process__list li {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: clamp(24px, 4vw, 64px);
  padding: 2rem clamp(32px, 5vw, 80px);
  border-bottom: 1px solid #68766e;
}

.delivery-process__list li:last-child {
  border-bottom: 0;
}

.delivery-process__list > li > span {
  color: #aeb9b1;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
}

.delivery-process__list h3 {
  margin-bottom: 0.55rem;
  color: #fffdf7;
}

.delivery-process__list p {
  max-width: 640px;
  margin-bottom: 0;
  color: #cbd3ca;
  line-height: 1.55;
}

.delivery-cta {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  align-items: center;
  gap: clamp(48px, 8vw, 128px);
  padding: 88px max(24px, calc((100vw - 1280px) / 2));
  border-bottom: 1px solid var(--ink);
  background: #d8d2c6;
}

.delivery-cta h2 {
  max-width: 720px;
  margin-bottom: 0;
  font-size: clamp(2.2rem, 3.4vw, 4.2rem);
}

.delivery-cta__contact {
  max-width: 500px;
}

.delivery-cta__contact p {
  margin-bottom: 1.5rem;
  color: #393d37;
  font-size: 1.04rem;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .delivery-hero {
    grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
  }

  .delivery-hero__content {
    padding-left: 32px;
  }

  .receiving {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .section-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.7fr);
    max-width: none;
    column-gap: 3rem;
  }

  .section-heading .eyebrow {
    grid-column: 1 / -1;
  }

  .section-heading h2,
  .section-heading > p:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 840px) {
  .delivery-hero {
    grid-template-columns: 1fr;
  }

  .delivery-hero__content {
    padding: 64px 24px;
  }

  .delivery-hero__visual {
    min-height: 540px;
    border-top: 1px solid var(--ink);
    border-left: 0;
  }

  .receiving {
    padding-block: 72px;
  }

  .section-heading {
    display: block;
  }

  .section-heading h2 {
    margin-bottom: 1rem;
  }

  .receiving__options {
    grid-template-columns: 1fr;
  }

  .receiving-card + .receiving-card {
    border-top: 1px solid var(--ink);
    border-left: 0;
  }

  .receiving-card__topline {
    margin-bottom: 2.5rem;
  }

  .delivery-process {
    grid-template-columns: 1fr;
  }

  .delivery-process__heading {
    padding: 64px 24px 42px;
  }

  .delivery-process__list {
    border-top: 1px solid #68766e;
    border-left: 0;
  }

  .delivery-cta {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-block: 72px;
  }
}

@media (max-width: 560px) {
  .delivery-hero__content {
    padding: 42px 18px 48px;
  }

  .delivery-hero h1 {
    margin-bottom: 1.15rem;
    font-size: clamp(2rem, 10vw, 2.75rem);
    line-height: 1;
  }

  .delivery-hero__lead {
    margin-bottom: 1.6rem;
    font-size: 1rem;
  }

  .delivery-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .delivery-facts {
    grid-template-columns: 1fr;
    margin-top: 2.25rem;
    border-bottom: 0;
  }

  .delivery-facts div,
  .delivery-facts div:first-child {
    display: grid;
    grid-template-columns: 96px 1fr;
    padding: 0.75rem 0;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .delivery-facts dt {
    margin-bottom: 0;
  }

  .delivery-hero__visual {
    min-height: 440px;
  }

  .delivery-hero__badge {
    top: 1rem;
    left: 1rem;
  }

  .delivery-hero__caption span:last-child {
    display: none;
  }

  .receiving {
    padding: 56px 18px;
  }

  .receiving-card {
    padding: 26px 22px 30px;
  }

  .delivery-process__heading {
    padding: 56px 18px 36px;
  }

  .delivery-process__list li {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 0.75rem;
    padding: 1.6rem 18px;
  }

  .delivery-cta {
    padding: 56px 18px;
  }

  .delivery-cta h2 {
    font-size: clamp(2rem, 9.5vw, 2.8rem);
  }

  .delivery-cta .delivery-button {
    width: 100%;
  }
}
</style>
