export default function useUploadImage() {
  /**
   * h5上传
   * @param file
   */
  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append(
      'stream',
      JSON.stringify({ key: `${new Date().getTime()}_${file.name}` }),
    );
    return {};
  };

  return {
    handleImageUpload,
  };
}
