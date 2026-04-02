<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  formspreeId: string;
}>();

const name = ref("");
const email = ref("");
const message = ref("");
const status = ref<"idle" | "submitting" | "success" | "error">("idle");
const errorMessage = ref("");

async function handleSubmit() {
  status.value = "submitting";
  errorMessage.value = "";

  try {
    const response = await fetch(
      `https://formspree.io/f/${props.formspreeId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          message: message.value,
        }),
      },
    );

    if (response.ok) {
      status.value = "success";
      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      status.value = "error";
      errorMessage.value = "Something went wrong. Please try again.";
    }
  } catch {
    status.value = "error";
    errorMessage.value = "Network error. Please check your connection.";
  }
}
</script>

<template>
  <!-- Success state -->
  <div
    v-if="status === 'success'"
    class="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center"
  >
    <p class="text-lg font-medium text-neutral-900">Message sent</p>
    <p class="mt-2 text-neutral-500">
      Thank you for reaching out. We'll get back to you soon.
    </p>
    <button
      type="button"
      class="mt-6 text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
      @click="status = 'idle'"
    >
      Send another message
    </button>
  </div>

  <!-- Form -->
  <form v-else class="space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block text-sm font-medium text-neutral-900">
        Name
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        placeholder="Your name"
        class="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-neutral-900">
        Email
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        placeholder="you@example.com"
        class="mt-2 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
    </div>

    <div>
      <label for="message" class="block text-sm font-medium text-neutral-900">
        Message
      </label>
      <textarea
        id="message"
        v-model="message"
        required
        rows="5"
        placeholder="How can we help?"
        class="mt-2 block w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
      />
    </div>

    <!-- Error message -->
    <p v-if="status === 'error'" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <button
      type="submit"
      :disabled="status === 'submitting'"
      class="inline-flex items-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
    >
      <span v-if="status === 'submitting'">Sending...</span>
      <span v-else>Send message</span>
    </button>
  </form>
</template>
