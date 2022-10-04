<template lang="pug">
#profileBody
    #helper
    #basicUserInfo
        .userInfoTitle Reports
        .userInfoView(v-if="!editProfile")
        p First Name: reporto
        p Last Name: the reporter
        form.changeButton
            button.profileButton(v-on:click="editProfile = true") Change
        .userInfoForm(v-if="editProfile")
        form
            label.profileLabel(for="firstName") First Name:
            input.profileInput(type="text", name="firstName", id="firstName", v-model="firstName", required)
            br
            label.profileLabel(for="lastName") Last Name:
            input.profileInput(type="text", name="lastName", id="lastName", v-model="lastName", required=true)
            br
            button.profileButton(type="submit" v-on:click="editProfile = false") Change

</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default {
    name: "MyReportsWindow",
}
</script>

<style lang="sass" scoped>

    #profileBody
      display: flex
      align-items: center

      .profileLabel
        font-size: 1em
        margin-right: 1em
</style>