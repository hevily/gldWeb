<template>
  <div style="position:relative">
    <div v-if="!isFirst" style="padding: 0px;border-bottom: 1px solid #eee;">
      <a-icon type="minus" style="margin-right: 3px;"/>
      {{model.name}}
    </div>
    <div v-else style="padding: 0px 10px;border-bottom: 1px solid #eee;">{{model.name}}</div>
    <!-- <div v-else style="padding: 0px 10px;border-bottom: 1px solid #eee;">{{model.name}}</div> -->
    <div v-if="model.child" style="margin-left:15px">
      <ItemLsit v-for="(cel,key) in model.child" :model="cel" :key="key" :isFirst="false"></ItemLsit>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemLsit',
  props: ['model', 'isFirst'],
  data() {
    return {}
  }
}
</script>

<style>
</style>
