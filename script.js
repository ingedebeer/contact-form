const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            formData: {
                name: '',
                email: '',
                message: ''
            },
            submittedData: {
                name: '',
                email: '',
                message: ''
            },
            errors: {
                name: '',
                email: '',
                message: ''
            },
            isSubmitting: false,
            showModal: false,
            focusedField: null,
            showShake: false,
            validationRules: {
                name: {
                    minLength: 2,
                    maxLength: 50,
                    pattern: /^[a-zA-Z\s'-]+$/
                },
                email: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                },
                message: {
                    minLength: 10,
                    maxLength: 500
                }
            }
        }
    },
    computed: {
        isFormValid() {
            return !this.errors.name && 
                   !this.errors.email && 
                   !this.errors.message &&
                   this.formData.name.length >= this.validationRules.name.minLength &&
                   this.formData.email.match(this.validationRules.email.pattern) &&
                   this.formData.message.length >= this.validationRules.message.minLength &&
                   this.formData.message.length <= this.validationRules.message.maxLength;
        },
        isMessageTooLong() {
            return this.formData.message.length > this.validationRules.message.maxLength;
        }
    },
    methods: {
        validateField(field) {
            const value = this.formData[field];
            const rules = this.validationRules[field];
            
            this.errors[field] = '';

            if (!value.trim()) {
                this.errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                return;
            }

            switch(field) {
                case 'name':
                    if (value.length < rules.minLength) {
                        this.errors[field] = `Name must be at least ${rules.minLength} characters`;
                    } else if (value.length > rules.maxLength) {
                        this.errors[field] = `Name must be less than ${rules.maxLength} characters`;
                    } else if (!rules.pattern.test(value)) {
                        this.errors[field] = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                    }
                    break;

                case 'email':
                    if (!rules.pattern.test(value)) {
                        this.errors[field] = 'Please enter a valid email address';
                    }
                    break;

                case 'message':
                    if (value.length < rules.minLength) {
                        this.errors[field] = `Message must be at least ${rules.minLength} characters`;
                    } else if (value.length > rules.maxLength) {
                        this.errors[field] = `Message must be less than ${rules.maxLength} characters`;
                    }
                    break;
            }
        },
        validateForm() {
            ['name', 'email', 'message'].forEach(field => {
                this.validateField(field);
            });
            return this.isFormValid;
        },
        shakeButton() {
            this.showShake = true;
            setTimeout(() => {
                this.showShake = false;
            }, 500);
        },
        focusFirstError() {
            const firstError = Object.keys(this.errors).find(key => this.errors[key]);
            if (firstError) {
                this.$refs[`${firstError}Input`].focus();
            }
        },
        async submitForm() {
            if (!this.validateForm()) {
                this.shakeButton();
                this.focusFirstError();
                return;
            }

            this.isSubmitting = true;

            try {
                // Store the submitted data before resetting the form
                this.submittedData = {
                    name: this.formData.name,
                    email: this.formData.email,
                    message: this.formData.message
                };

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show modal
                this.showModal = true;
                
                // Reset form
                this.formData = {
                    name: '',
                    email: '',
                    message: ''
                };
                this.errors = {
                    name: '',
                    email: '',
                    message: ''
                };
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                this.isSubmitting = false;
            }
        },
        closeModal() {
            this.showModal = false;
            // Focus the name input after modal closes
            this.$nextTick(() => {
                this.$refs.nameInput.focus();
            });
        }
    },
    mounted() {
        // Focus the name input when the form loads
        this.$nextTick(() => {
            this.$refs.nameInput.focus();
        });
    }
});

// Mount the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
}); 
