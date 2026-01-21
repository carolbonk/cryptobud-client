export const encodeImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const imageType = fileName.split('.')[1];
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      const image = fileReader.result;
      const trimmedImage = image.split(',')[1];
      resolve({ trimmedImage, imageType });
    });

    fileReader.addEventListener('error', (error) => {
      reject(error);
    });

    fileReader.readAsDataURL(file);
  });
};
