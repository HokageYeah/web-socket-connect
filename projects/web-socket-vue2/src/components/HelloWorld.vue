<template>
  <div>
    <div v-if="countdown > 0">倒计时：{{ countdown }}秒</div>
    <div v-else>
      <button @click="claimCoupon" :disabled="loading">抢券</button>
      <p v-if="loading">正在请求接口...</p>
      <p v-if="couponClaimed">恭喜！券已抢到！</p>
    </div>
    <button @click="clickTime">点击计时</button>
    <button @click="clearTime">消除计时</button>
  </div>
</template>

<script>
import Query from "./test";

export default {
  data() {
    return {
      countdown: 10,
      loading: false,
      couponClaimed: false,
      myIntervalId: null,
    };
  },
  mounted() {
    this.startCountdown();
    const data = [
      { id: 1, name: "Alice", age: 30 },
      { id: 2, name: "Bob", age: 25 },
      { id: 3, name: "Charlie", age: 35 },
      { id: 4, name: "David", age: 20 },
    ];

    const result = new Query(data)
      .filter((item) => item.age >= 30)
      .sort((a, b) => a.name.localeCompare(b.name))
      .groupBy("age")
      .execute();

    console.log(result);
  },
  methods: {
    startCountdown() {
      const intervalId = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    },
    async claimCoupon() {
      this.loading = true;
      try {
        // 发起请求抢券的接口请求
        // await api.claimCoupon();
        this.couponClaimed = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    clickTime() {
      this.myIntervalId && this.myIntervalId.clear();
      this.myIntervalId = this.mysetInterval(function () {
        console.log("myInterval callback");
      }, 1000);
    },
    clearTime() {
      // this.stopMyInterval(this.myIntervalId());
      this.myIntervalId.clear();
    },
    stopMyInterval(timerId) {
      clearTimeout(timerId);
    },
    mysetInterval(callback, time) {
      let timerId;
      function interval() {
        clearTimeout(timerId);
        timerId = setTimeout(interval, time);
        callback();
        return timerId;
      }
      setTimeout(interval, time);
      return {
        clear: () => {
          clearTimeout(timerId);
        },
      };
      // return function () {
      //   return timerId;
      // };
    },
  },
};
</script>
