<template>
    <div class="alert_msg_div">
        <!-- <v-alert class="inside_alert bg-white mt-3 text-green-darken-3 " prominent variant="outlined" border="top">
            <v-icon icon="mdi-checkbox-marked-circle-outline" class="mr-3 text-white bg-green-darken-3" ></v-icon>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </v-alert>
        <v-alert class="inside_alert bg-white mt-3 text-red-darken-3 " prominent variant="outlined" border="top">
            <v-icon icon="mdi-progress-close" class="mr-3 text-white bg-red-darken-3" ></v-icon>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </v-alert> -->
        <v-alert class="inside_alert bg-white mt-3" :class="{'text-red-darken-3': message.type == 'error', 'text-green-darken-3': message.type == 'success'}" prominent variant="outlined" border="top" v-if="message">
            <v-icon icon="mdi-checkbox-marked-circle-outline" class="mr-3 text-white bg-green-darken-3" v-if="message.type == 'success'"></v-icon>
            <v-icon icon="mdi-progress-close" class="mr-3 text-white bg-red-darken-3" v-if="message.type == 'error'"></v-icon>
            {{message.text}}
        </v-alert>
    </div>
</template>
  
<script>
import bus from 'vue3-eventbus';
export default {
    data() {
        return {
            message: null,
            route: null
        };
    },
    mounted() {
        let timer;
        bus.on('flash-message', (message, route) => {
            clearTimeout(timer);

            this.message = message;
            this.route = route;

            timer = setTimeout(() => {
                if(route) {
                    window.location.href = route;
                }
                this.message = null;
                this.route = null;
            }, 5000);
        });
    }
}
</script>
  