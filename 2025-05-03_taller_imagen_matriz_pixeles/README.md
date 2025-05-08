# 🧪 Taller - De Píxeles a Coordenadas: Explorando la Imagen como Matriz

## 🗓️ Fecha

2025-05-03

---

## 🎯 Objetivo del Taller

Comprender cómo se representa una imagen digital como una matriz numérica y manipular sus componentes a nivel de píxel. Se abordaron conceptos de color, regiones, transformaciones y visualización cuantitativa de intensidad de píxeles.

---

## 🧬 Conceptos Aprendidos

* Lectura de una imagen con OpenCV y conversión de espacio de color BGR a RGB.
* Extracción y visualización de canales individuales en RGB y HSV.
* Manipulación por regiones usando slicing de NumPy:

  * Cambio de color por bloques.
  * Copia de una región a otra.
  * Inversión de colores en una franja.
* Cálculo y graficación de histogramas RGB con `cv2.calcHist`.
* Aplicación de transformaciones lineales para brillo y contraste.
* Creación de interfaz interactiva con sliders usando `cv2.createTrackbar`.

---

## 🔧 Herramientas y Entorno

* Python (Jupyter Notebook o Google Colab)
* OpenCV (cv2)
* NumPy
* Matplotlib

---

## 📁 Estructura del Proyecto

```
2025-05-03_taller_ojos_digitales/
├── python/             # Implementación en python
├── resultados/         # Animaciones en formato gif
├── datos/              # Imagen utilizada
├── README.md
```

---

## Fragmentos Destacados del Código

### 📷 Carga y Conversión de Color

```python
bgr = cv2.imread(ruta)
rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
```

Esto permite obtener una imagen en RGB, que es el formato adecuado para visualización con Matplotlib.

---

### 📊 Visualización de Canales

```python
canales_rgb = cv2.split(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
canales_hsv = cv2.split(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV))
```

Separar los canales de color ayuda a entender qué componente contribuye más en ciertas regiones.

---

### 🔳 Modificación de Regiones

```python
mod[0:100, 0:150] = [255, 0, 0]  # Rectángulo rojo
centro = mod[100:200, 100:200].copy()
mod[-100:, -100:] = centro  # Copiar zona central
mod[:, 250:300] = 255 - mod[:, 250:300]  # Inversión de colores
```

Estas operaciones muestran cómo podemos trabajar a nivel de submatrices en la imagen.

---

### 🔹 Histograma de Canales RGB

```python
for i, color in enumerate(('r', 'g', 'b')):
    hist = cv2.calcHist([img_rgb], [i], None, [256], [0, 256])
    plt.plot(hist, color=color)
```

Permite ver la distribución de intensidad de cada canal.

---

### 🔄 Ajuste de Brillo y Contraste

```python
ajustada = cv2.convertScaleAbs(img, alpha=1.5, beta=40)
```

`alpha` modifica el contraste, `beta` el brillo.

---

### 🕹️ Interfaz con Sliders

```python
cv2.createTrackbar('Contraste x10', 'Ajustes', 10, 30, on_change)
cv2.createTrackbar('Brillo', 'Ajustes', 100, 200, on_change)
```

Interactividad para explorar ajustes visuales en tiempo real.

---

## 📊 Resultados Visuales

* Canales, slicing, histograma, brillo y contraste

![canales_slicing_histograma.gif](resultados/canales_slicing_histograma.gif)

* Sliders de modificación

![visualizacion_sliders.gif](resultados/visualizacion_sliders.gif)

---

## 🤐 Prompts Utilizados

* "Explícame la diferencia entre RGB y HSV y para qué sirve cada uno."
* "¿Cómo puedo acceder a una región rectangular de una imagen usando NumPy?"
* "¿Cómo invertir los colores de una franja vertical en una imagen?"
* "¿Cómo calcular el histograma de una imagen por canal en OpenCV?"
* "Muéstrame cómo crear sliders de brillo y contraste en OpenCV paso a paso."

---

## 💬 Reflexión Final

Este taller me ayudó a visualizar la estructura matricial de una imagen como algo completamente manipulable mediante código. La posibilidad de acceder, modificar y visualizar regiones específicas refuerza el concepto de que cada imagen es, en esencia, un arreglo tridimensional. Las operaciones de histograma me ayudaron a cuantificar información que normalmente se percibe solo a nivel visual. La creación de sliders interactivos fue importante para entender el efecto progresivo del brillo y contraste. Como dificultad encontré inicialmente confuso el orden de canales en OpenCV (BGR vs RGB), pero se resolvió con pruebas visuales.

---
