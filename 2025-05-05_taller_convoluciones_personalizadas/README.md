# 💪 Taller - Filtro Visual: Convoluciones Personalizadas

## 🗓️ Fecha

2025-05-05

---

## 🎯 Objetivo del Taller

Aplicar el concepto de convolución en procesamiento de imágenes mediante la implementación manual de filtros personalizados (sharpen, blur, bordes), comparando sus resultados con las funciones de OpenCV.

---

## 🧬 Conceptos Aprendidos

* Convolución 2D aplicada manualmente con NumPy.
* Uso de kernels para modificar el contenido visual de una imagen:

  * Enfoque (sharpen)
  * Suavizado (blur)
  * Detección de esquinas (bordes cruzados Sobel)
* Comparación entre la implementación manual y `cv2.filter2D`.

---

## 🔧 Herramientas y Entornos

* Python (Jupyter Notebook o Google Colab)
* OpenCV (`opencv-python`)
* NumPy
* Matplotlib

---

## 📁 Estructura del Proyecto

```
2025-05-05_taller_convoluciones_personalizadas/
├── python/             # Implementación en python
├── resultados/         # Capturas resultantes
├── datos/              # Imagen utilizada
├── README.md
```

---

## 🔪 Implementación

### 📷 Carga y Preprocesamiento de Imagen

```python
imagen = cv2.imread("mikito.jpg", cv2.IMREAD_GRAYSCALE)
```

Carga una imagen en escala de grises para facilitar el procesamiento pixel a pixel.

---

### 🧠 Convolución 2D Manual con Padding Reflectivo

```python
def convolucion_manual(imagen, kernel):
    kh, kw = kernel.shape
    pad_h, pad_w = kh // 2, kw // 2
    imagen_padded = np.pad(imagen, ((pad_h, pad_h), (pad_w, pad_w)), mode='reflect')
    salida = np.zeros_like(imagen, dtype=np.float32)

    for y in range(imagen.shape[0]):
        for x in range(imagen.shape[1]):
            region = imagen_padded[y:y+kh, x:x+kw]
            salida[y, x] = np.sum(region * kernel)

    return np.clip(salida, 0, 255).astype(np.uint8)
```

Aplica el filtro convolucional recorriendo manualmente cada región de la imagen.

---

### 🔎 Diseño de Filtros Personalizados

```python
def kernel_enfoque():
    return np.array([[0, -1, 0],
                     [-1, 5, -1],
                     [0, -1, 0]], dtype=np.float32)

def kernel_promedio():
    return np.ones((3, 3), dtype=np.float32) / 9

def kernel_esquinas():
    sobel_x = np.array([[-1, 0, 1],
                        [-2, 0, 2],
                        [-1, 0, 1]], dtype=np.float32)
    sobel_y = np.array([[-1, -2, -1],
                        [0,  0,  0],
                        [1,  2,  1]], dtype=np.float32)
    return sobel_x, sobel_y
```

Define tres filtros clásicos con matrices de convolución. El de esquinas usa Sobel cruzado.

---

### 🎨 Visualización de Resultados Comparativos

```python
mostrar_resultados(["Enfoque Manual", "Enfoque OpenCV"], [img_enfoque, opencv_enfoque])
```

Presenta de forma comparativa los resultados obtenidos de forma manual y con OpenCV.

---

## 📊 Resultados Visuales

* Comparaciones manual vs opencv

![comparaciones_opencv_manual.gif](resultados/comparaciones_opencv_manual.gif)

---

## ✅ Prompts Utilizados

* "¿Cómo puedo implementar una convolución 2D manual en Python usando NumPy?"
* "Diseña un kernel que enfoque los bordes sin aumentar el ruido."
* "¿Cómo comparar visualmente dos versiones de una misma imagen en Matplotlib?"

---

## 💬 Reflexión Final

Este taller consolidó mi comprensión sobre el funcionamiento de los filtros en procesamiento de imágenes. Implementar la convolución manualmente me permitió visualizar el efecto de cada elemento del kernel en los pixeles vecinos, a diferencia de simplemente usar funciones predefinidas. La comparación directa con OpenCV mostró lo eficiente que es la biblioteca, pero también lo valioso de conocer lo que sucede detrás.
