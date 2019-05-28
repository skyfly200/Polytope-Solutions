<template lang="pug">
.page
    v-stepper(v-model="currentStep")
        v-stepper-header
            v-stepper-step(@click="goto($event, 1)" :complete="currentStep > 1" step="1") Step 1
            <v-divider></v-divider>
            v-stepper-step(@click="goto($event, 2)" :complete="currentStep > 2" step="2") Step 2
            <v-divider></v-divider>
            v-stepper-step(@click="goto($event, 3)" :complete="currentStep > 3" step="3") Step 3
            <v-divider></v-divider>
            v-stepper-step(@click="goto($event, 4)" :complete="sent" step="4") Done
        v-stepper-items
            v-stepper-content(v-for="n in (steps - 1)" :step="n" :key="n")
                Survey.form
                .buttons
                    v-btn(v-if="!firstStep" @click="back") Back
                    v-btn(@click="next") Next
            v-stepper-content(:step="steps")
                .verify(v-if="!sent")
                    h1 Verify Your Info
                    p show entered data here
                    .buttons
                        v-btn(@click="back") Back
                        v-btn(@click="send") Send
                .confirmation(v-else)
                    h1 Sent!
                    .buttons
                        v-btn(to="/") Back to Home
    Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Survey from "@/components/Survey.vue";
import Footer from "@/components/Footer.vue";

@Component({
    components: { Survey, Footer }
})
export default class Form extends Vue {
    currentStep:number = 1;
    steps:number = 4;
    sent:boolean = false;
    completed:number = 0;
    
    next($event:any) {
        if (!this.lastStep) {
            if (this.currentStep > this.completed) this.completed = this.currentStep;
            this.currentStep++;
        }
    }
    back($event:any) {
        if (!this.firstStep) this.currentStep--;
    }
    goto($event:any, n:number) {
        if (!!n && !this.sent && (n <= this.completed + 1)) this.currentStep = n;
    }

    send() {
        this.sent = true;
    }

    get firstStep() {
        return this.currentStep === 1;
    }

    get lastStep() {
        return this.currentStep === this.steps;
    }
}
</script>

<style lang="sass" scoped>
.page
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    .v-stepper
        flex-grow: 1
        display: flex
        flex-direction: column
    .v-stepper__items
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-content: center
    .v-stepper__content
        flex-grow: 1
        display: flex
        flex-direction: column
        justify-content: space-between
    .v-stepper__wrapper
        height: 100%
    .verify
        width: 100%
    .confirmation
        margin: 20% 0
    .buttons
        flex-grow: 1
        padding-bottom: 1em
</style>
