<template>
  <div>
    <Hero
      copy="Developer. Product Builder. Music Lover."
      :image="require('~/assets/img/about.svg')"
      class="md:mb-20"
    />
    <div class="mt-8 w-full md:w-8/12 mx-auto">
      <p>Hey there! <br> My name is Mário Balça, pleasure to meet you.</p>
      <p>
        I’m a full stack web developer and have been building digital products for quite some time now. Throughout
        my career I’ve had the chance to work with a lot of different people and learned a lot from every single one
        of them. I’ve been on different sides of the industry, worked some time on consulting businesses but over these
        last few years I’ve been mostly working with startups, usually SaaS businesses, and dedicating some time to
        personal side hustles.
      </p>
      <p>
        My skillset includes tools like Laravel, Rails, Vue, React, TailwindCSS but nowadays that’s sort of irrelevant.
        I’m really passionate about front-end development, building beautiful and really well thought user experiences
        is what drives me the most, and I believe that I’m really good at it.
      </p>
      <p>
        Currently I’m working on <a href="https://improove.se" target="_blank">Improove</a>, building
        <a href="https://patreon.com/ripplr">Ripplr</a> and doing some <nuxt-link to="/work">other projects</nuxt-link>.
        Let me know if you want to do business together!
      </p>
    </div>
  </div>
</template>
