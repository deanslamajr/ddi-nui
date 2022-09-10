function uploadImage(imageFile: File, signedRequest: string) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve();
        } else {
          // @todo better UX
          console.error("could not upload file!");
          reject();
        }
      }
    };
    xhr.send(imageFile);
  });
}

export default uploadImage;
