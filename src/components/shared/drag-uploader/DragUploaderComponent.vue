<template>
  <div>
    <form
      class="box"
      ref="fileform"
      enctype="multipart/form-data"
      @submit.prevent="submit($event)"
      :class="{'drag-active': isDragActive, 'empty': isEmpty, 'multiply': multiply, 'loading': isLoading}"
    >
      <div class="box__input">
        <input class="box__file" type="file" ref="files" name="files[]" :id="'file--' + id" />
        <label class="box__label" :for="'file--' + id">
          <span class="box__label-text">{{label}}</span>
        </label>
        <v-progress-circular class="loader" :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <div class="box__preview" v-if="file">
        <div class="box__preview-element">
          <v-img :src="file.url" :alt="file.key"></v-img>
          <div></div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import imageApi from "@/service/api/image";
import HttpError from "@/service/local/HttpErrorService";
export default {
  name: "DragUploaderComponent",
  props: {
    multiply: Boolean,
    enabled: Boolean,
    file: null,
    label: String
  },
  data: function() {
    return {
      isDragActive: false,
      isLoading: false,
      error: null,
      id: null
    };
  },
  computed: {
    isEmpty: function() {
      return !this.file;
    }
  },
  mounted: function() {
    this.id = this._uid;
    const that = this;
    let dropArea = this.$refs.fileform;
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, this.preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach(eventName => {
      dropArea.addEventListener(
        eventName,
        e => (this.isDragActive = true),
        false
      );
    });
    ["dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(
        eventName,
        e => (this.isDragActive = false),
        false
      );
    });
    ["change", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, $event => this.upload($event));
    });
  },
  methods: {
    submit: function() {},
    preventDefaults: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    upload: function($event) {
      if (this.isLoading) return;

      this.error = false;
      if (!this.$refs.files.files.length) {
        return;
      }

      let files = this.$refs.files.files;

      let targetFile = files["0"];
      this.isLoading = true;
      let fd = new FormData();
      fd.append("file", targetFile, targetFile.filename);
      imageApi
        .upload(fd)
        .then(response => {
          this.$emit("file-change", response.data);
        })
        .catch(error => {
          HttpError.catch(error);
        })
        .finally(() => (this.isLoading = false));

      console.log(targetFile);
    }
  }
};
</script>

<style lang="scss" scope>
.box {
  display: flex;
  flex-direction: row;
  min-height: 120px;
  box-sizing: border-box;
  .box__input {
    flex: 1;
    box-sizing: border-box;
    position: relative;

    .box__file {
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .box__label {
      width: 100%;
      height: 100%;
      display: inline-block;
      position: relative;
      cursor: pointer;

      .box__label-text {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        line-height: 20px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.57);
        transform: translateY(-50%);
        text-align: center;
      }
    }
    .loader {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .box__preview {
    flex: 1;
    box-sizing: border-box;
    display: grid;
    grid-column: 1;
    grid-row: 1;
    .box__preview-element {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &.drag-active {
    outline: 2px dashed blueviolet;
    .box__label,
    .box__preview {
      opacity: 0.5;
    }
  }

  &.empty {
    .box__preview {
      display: none;
    }
  }

  &.loading{
    .box__input{
      .loader {
        display: block;
      }
    }
  }
}
</style>
