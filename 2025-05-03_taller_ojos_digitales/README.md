# 🧪 Taller - Ojos Digitales: Introducción a la Visión Artificial

**Percepción Visual Básica usando OpenCV: Grises, Filtros y Bordes**

## 🗓️ Fecha

2025-05-03

---

## 🎯 Objetivo del Taller

Comprender cómo los computadores interpretan información visual a través de imágenes, usando OpenCV para aplicar filtros y detectar bordes. Se explora desde la conversión a escala de grises hasta la aplicación de filtros Sobel, Laplaciano y blur.

---

## 🧠 Conceptos Aprendidos

* Lectura y manipulación de imágenes con OpenCV.
* Conversión a escala de grises para simplificar procesamiento.
* Aplicación de filtros convolucionales:

  * Blur (suavizado)
  * Sharpen (agudizado)
* Detección de bordes con:

  * Sobel (ejes X e Y)
  * Laplaciano
* Visualización de resultados con Matplotlib y ventanas OpenCV.
* Interactividad con sliders (cv2.createTrackbar).

---

## 🔧 Herramientas y Entornos

* Python (Jupyter Notebook o Google Colab)
* OpenCV
* NumPy
* Matplotlib

---

## 📁 Estructura del Proyecto

```
2025-05-03_taller_ojos_digitales/
├── python/             # Implementación en python
├── resultados/         # Animaciones en formato gif e imagenes
├── datos/              # Imagen utilizada
├── README.md
```

---

## Implementación Destacada

### 🖼️ Cargar imagen y convertir a escala de grises

```python
imagen = cv2.imread(ruta)
gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
```

Se convierte la imagen a grises para facilitar el cálculo de filtros (1 sola banda de intensidad).

### 🛋️ Aplicar filtros

```python
cv2.blur(gris, (5,5))
```

Filtro de suavizado que reduce el ruido.

```python
sharpen_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
sharpened = cv2.filter2D(gris, -1, sharpen_kernel)
```

Filtro de agudizado que resalta contornos.

### 🔬 Sobel y Laplaciano

```python
sobel_x = cv2.Sobel(gris, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(gris, cv2.CV_64F, 0, 1, ksize=3)
sobel_mag = np.sqrt(sobel_x**2 + sobel_y**2)
```

El filtro Sobel detecta bordes orientados horizontal y verticalmente.

```python
laplacian = cv2.Laplacian(gris, cv2.CV_64F)
```

El filtro Laplaciano detecta cambios bruscos de intensidad en todas las direcciones.

### 🎨 Visualización

```python
plt.imshow(imagen, cmap='gray')
```

Se muestran los resultados en subplots comparativos.

---

## 📹 Resultados Visuales

Comparación de imagen original, blur, sharpen, Sobel y Laplaciano.

![miquito_filtros.png](resultados/miquito_filtros.png)

Visualizacion webcam y sliders.

![ojos_virtuales.gif](resultados/ojos_virtuales.gif)

---

## 📋 Prompts Utilizados

* "Explica la diferencia entre Sobel y Laplaciano."
* "¿Cómo crear un trackbar en OpenCV para cambiar parámetros en tiempo real?"
* "¿Por qué se usa escala de grises para detección de bordes?"
* "Dame un kernel de agudizado para usar con filter2D."
* "¿Qué hace el filtro Laplaciano y cómo aplicarlo en Python?"

---

## 🗣️ Reflexión Final

Este taller me ayudó a entender de forma visual cómo un computador puede identificar formas o contornos en una imagen. El contraste entre el blur (suavizado) y los bordes resaltados por Sobel o Laplaciano me permitió apreciar cómo se realiza el preprocesamiento en tareas de visión artificial. La parte interactiva con sliders hizo el proceso mucho más intuitivo y demostró cómo varía la salida según los parámetros elegidos. La dificultad mayor fue entender el efecto de cada kernel y la diferencia entre derivadas direccionales (Sobel) y de segundo orden (Laplaciano).
