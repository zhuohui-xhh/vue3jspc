<script setup>
const open = () => {
  ElMessage('This is a message.')
}
// getDay()
getInfo({ page: 1, pageSize: 10 }).then((data) => {
  console.log(data)
})
console.log(123132123123123)
</script>

<template>
  <header>
    <!-- <img src="@/assets/1.png" alt="" /> -->
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <el-button :plain="true" @click="open">Show message</el-button>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <div>
    <!-- 这个是elementPlus 自带的引入方式 -->
    <el-icon size="25"><i-ep-search /></el-icon>

    <!-- 这个是我们引入的icon 自动导入的引入方式 -->
    <!-- i 是修改的路径-ep是图标集合-search是图标名称 -->
    <el-icon size="25"><i-ep-search /></el-icon>
    <el-icon size="25"><i-ep-plus /></el-icon>
  </div>
  <div class="red">23423423423423</div>
  <RouterView />
</template>

<style scoped lang="scss">
.red {
  color: $red;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
