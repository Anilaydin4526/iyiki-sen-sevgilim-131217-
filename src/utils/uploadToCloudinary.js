export async function uploadToCloudinary(file) {
  try {
    console.log('Dosya yükleme başladı:', file.name, file.size, file.type);
    
    // Dosya boyutu kontrolü (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Dosya boyutu 10MB\'dan büyük olamaz!');
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Desteklenmeyen dosya tipi! Sadece resim, video ve ses dosyaları kabul edilir.');
    }

    const url = 'https://api.cloudinary.com/v1_1/dejdb80bv/auto/upload';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'iyikisen');
    
    console.log('Cloudinary\'ye yükleniyor...');
    
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    console.log('Cloudinary yanıtı:', res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`Yükleme hatası: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Cloudinary yanıt verisi:', data);
    
    if (data.error) {
      throw new Error(`Cloudinary hatası: ${data.error.message}`);
    }

    console.log('Dosya başarıyla yüklendi:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    
    // Cloudinary başarısız olursa, dosyayı localStorage'a kaydet
    try {
      console.log('Cloudinary başarısız, localStorage\'a kaydediliyor...');
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          const dataUrl = e.target.result;
          const fileName = `local_${Date.now()}_${file.name}`;
          
          // localStorage'a kaydet
          localStorage.setItem(fileName, dataUrl);
          
          console.log('Dosya localStorage\'a kaydedildi:', fileName);
          resolve(dataUrl);
        };
        
        reader.onerror = function() {
          reject(new Error('Dosya okuma hatası'));
        };
        
        reader.readAsDataURL(file);
      });
    } catch (localError) {
      console.error('localStorage kaydetme hatası:', localError);
      throw new Error('Dosya yüklenemedi. Lütfen tekrar deneyin.');
    }
  }
} 