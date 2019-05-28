<template lang="pug">
.page
    Nav
    v-stepper(v-model="currentStep")
        v-stepper-header
            template(v-for="n in stepCount")
                v-stepper-step( @click="goto($event, n)" :complete="currentStep > n" :step="n" :key="n") Step {{ n }}
                v-divider
            v-stepper-step(@click="goto($event, stepCount + 1)" :complete="sent" :step="stepCount + 1") Done
        v-stepper-items
            v-stepper-content(v-for="n in stepCount" :step="n" :key="n")
                .form
                    component(:is="topics[topic][n-1]")
                    .buttons
                        v-btn(v-if="!firstStep" @click="back") Back
                        v-btn(@click="next") Next
            v-stepper-content(:step="stepCount + 1")
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
import { Component, Prop, Vue } from "vue-property-decorator";
import Nav from "@/components/Nav.vue";
import Survey from "@/components/Survey.vue";
import Footer from "@/components/Footer.vue";

@Component({
    components: { Nav, Survey, Footer }
})
export default class Form extends Vue {
    currentStep:number = 1;
    sent:boolean = false;
    completed:number = 0;
    topics:any = {
        brand: [Survey, Survey, Survey, Survey, Survey],
        data: [Survey, Survey, Survey],
        web: [Survey, Survey, Survey]
    };

    @Prop({default: 'web'})
    topic:string;
    
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

    get stepCount() {
        return this.topics[this.topic].length;
    }

    get firstStep() {
        return this.currentStep === 1;
    }

    get lastStep() {
        return this.currentStep === this.stepCount;
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
        min-height: 25vh
    .confirmation
        margin: 20% 0
    .buttons
        flex-grow: 1
        padding-bottom: 1em
</style>
