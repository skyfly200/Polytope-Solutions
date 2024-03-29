<template lang="pug">
Base
    v-stepper(v-model="currentStep" vertical)
            template(v-for="n in stepCount")
                v-stepper-step.indigo--text.text--darken-2(:step="n" @click="select($event, n)" :complete="currentStep > n" color="secondary" :key="n + '-step'") {{ topics[topic][n-1].title }}
                v-stepper-content(:step="n" :key="n + '-content'")
                    .step
                        component.form(:is="topics[topic][n-1].component" @update="update($event)")
                        .buttons
                            v-btn(v-if="!firstStep" @click="back" depressed) Back
                            v-spacer
                            v-btn(@click="next" :disabled="!valid" depressed) Next
            v-stepper-step(:step="stepCount + 1" @click="select($event, stepCount+1)" color="secondary" light :complete="sent") Verify and Send
            v-stepper-content(:step="stepCount+1")
                .verify(v-if="!sent")
                    h1 Verify & Send
                    p verify your information and click send
                    p click back or select a section above if you need to make any changes
                    v-card
                        v-card-text
                            .verify(v-for="n in stepCount")
                                v-divider(v-if="n>1")
                                .section.pa-3
                                    h2 {{ topics[topic][n-1].title }}
                                    v-layout.fields(wrap)
                                        .field(v-for="(v, i) in data[n-1]")
                                            span.fieldTitle(v-if="i !== 'valid'") {{ i }}:&nbsp;
                                            span(v-if="i !== 'valid'") {{ v }
                    .buttons
                        v-btn(@click="back" depressed) Back
                        v-spacer
                        v-checkbox(v-if="false" v-model="verified" label="Everything looks good")
                        v-btn(@click="send" :disabled="!verified" depressed) Send
                .confirmation(v-else)
                    h1 Sent!
                    .buttons
                        v-btn(to="/" color="primary") Back to Home
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

import Base from "@/components/Base.vue";
import Identity from "@/components/fieldsets/Identity.vue";
import Background from "@/components/fieldsets/Background.vue";
import Inquery from "@/components/fieldsets/Inquery.vue";

@Component({
    components: { Base, Identity, Background, Inquery }
})
export default class Form extends Vue {
    currentStep:number = 1;
    sent:boolean = false;
    completed:number = 0;
    topics:any = {
        rng: [{title: "Identity", component: Identity}, {title: "Background", component: Background}, {title: "Inquery", component: Inquery}],
        consulting: [{title: "Identity", component: Identity}, {title: "Background", component: Background}, {title: "Inquery", component: Inquery}]
    };
    data:Array<any> = Array.from({length: this.stepCount}, v => {});
    valid: boolean = false;
    verified: boolean = true;

    @Prop(String) readonly topic!: string;

    get stepCount() {
        return this.topics[this.topic].length;
    }

    get firstStep() {
        return (this.currentStep === 1);
    }

    get lastStep() {
        return (this.currentStep === this.stepCount);
    }
    
    next(): void {
        if (this.valid) {
            if (this.currentStep > this.completed)
                this.completed = this.currentStep;
            this.valid = false;
            if (this.lastStep) {
                this.currentStep = this.stepCount + 1;
            } else {
                this.currentStep++;
            }
        }
    }

    back(): void {
        if (!this.firstStep) {
            this.valid = this.loadValid(this.currentStep - 2);
            this.currentStep--;
        }
    }

    loadValid(n: number) {
        let section = this.data[n];
        return section ? (section["valid"] ? section["valid"] : false) : false;
    }

    select($event:any, n:number): void {
        if (!!n && !this.sent && (n <= this.completed + 1)) {
            this.valid = this.loadValid(n-1);
            this.currentStep = n;
        }
    }

    update(data: any) {
        this.data[this.currentStep - 1] = data;
        this.valid = data["valid"];
    }

    send(): void {
        if (this.verified) {
            let t = this;
            let formData = {
                data: this.data,
                sections: this.topics[this.topic].map((x: any) => x.title),
                topic: this.topic
            };
            axios
                .post("https://polytopesolutions.com/.netlify/functions/form", formData)
                .then(function(response) {
                    console.log(response);
                    t.sent = true;
                })
                .catch(function(error) {
                    console.log(error);
                    // show user an error alert
                });
        }
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
    .v-stepper__step__step
        color: black
        font-weight: bold
    .v-stepper__content
        text-align: right
        flex-direction: column
    .verify, .confirmation
        text-align: center
    .fields
        display: flex
        justify-content: space-between
        .fieldTitle
            font-weight: bold
    .buttons 
        display: flex
</style>
