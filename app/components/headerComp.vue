<template>
  <header class="site-header">
    <span class="logo">Ballonvaart site</span>
    <nav>
      <a href="#">Home</a>
      <a href="#">Locaties</a>
      <a href="#">Contact</a>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem max(1.25rem, calc((100% - 1180px) / 2));
  border-bottom: 1px solid #e5eaf1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);

  .logo {
    color: #172033;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  nav {
    display: flex;
    gap: 1.4rem;

    a {
      position: relative;
      color: #667085;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 160ms ease;

      &::after {
        position: absolute;
        right: 0;
        bottom: -0.35rem;
        left: 0;
        height: 2px;
        transform: scaleX(0);
        border-radius: 99px;
        background: #2563eb;
        content: "";
        transition: transform 160ms ease;
      }

      &:hover {
        color: #172033;

        &::after {
          transform: scaleX(1);
        }
      }
    }
  }
}

@media (max-width: 600px) {
  .site-header {
    padding-inline: 1rem;

    nav {
      gap: 0.8rem;

      a {
        font-size: 0.78rem;
      }
    }
  }
}
</style>
