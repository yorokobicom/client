import RemoteValidation from '@/mixins/RemoteValidation'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [RemoteValidation],
  data() {
    return {
      automaticHandle: true,
      form: {
        id: null,
        handle: null,
        name: null
      },
      localMessages: {
        required_name: 'Please enter a name for your workspace.',
        required_handle: 'Please chose a unique URL for your workspace.',
        unauthorized: 'you dont have access',
        parametizable:
          'Your handle name should contain only letters, numbers and hyphens (-).',
        taken:
          'The handle you chosen is already taken. Please choose another one.'
      },
      state: {
        waitingRemoteResponse: false
      }
    }
  },
  watch: {
    'form.handle': function() {
      this.removeRequestErrors('handle')
    }
  },
  methods: {
    removeRequestErrors(attribute) {
      if (this.hasRequestErrors(attribute)) {
        this._.remove(this.requestErrors, {
          field: attribute
        })
      }
    },
    disableAutomaticHandle() {
      if (this.automaticHandle) {
        this.automaticHandle = false
      }
    },
    getParameterizedHandle() {
      let parameterized_name = this.form.name
        .toLowerCase()
        .replace(/\s+|_/g, '-')
        .match(/[a-zA-Z0-9-]/g)
      if (parameterized_name) {
        return parameterized_name.join('')
      }
    },
    dispatchWorkspace(action) {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.state.waitingRemoteResponse = true
        this.$store
          .dispatch(action, this.form)
          .then(() =>
            this.$router.push({
              name: 'workspace',
              params: { handle: this.form.handle }
            })
          )
          .catch(error => {
            this.state.waitingRemoteResponse = false
            if (error.response && error.response.status == 422) {
              this.requestErrors = error.response.data.errors
            }
          })
      }
    }
  },
  validations: {
    form: {
      name: { required_name: required },
      handle: {
        required_handle: required,
        parametizable(handle) {
          return /^[a-zA-Z0-9-]+$/.test(handle)
        },
        taken() {
          return !this.hasRequestErrors('handle', 'taken')
        }
      }
    }
  }
}
