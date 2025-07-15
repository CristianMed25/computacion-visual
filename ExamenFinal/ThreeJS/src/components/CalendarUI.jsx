import React, { useState, useMemo } from 'react'
import { MONTHS_INFO, EVENTS_2025, EVENT_TYPES } from '../data/eventsData'

function CalendarUI({ onAddEvent }) {
  const [selectedMonth, setSelectedMonth] = useState('Todos')
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  
  // Estado para el formulario de nuevo evento
  const [newEvent, setNewEvent] = useState({
    date: '',
    name: '',
    description: '',
    color: '#00bcd4'
  });

  const monthsArray = Object.values(MONTHS_INFO)

  const handleMonthSelect = (month) => {
    setSelectedMonth(month)
    if (month !== 'Todos') {
      const monthInfo = monthsArray.find(m => m.name === month)
      setSelectedInfo(monthInfo)
    } else {
      setSelectedInfo(null)
    }
  }

  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.date && newEvent.name) {
      onAddEvent(newEvent);
      // Resetear formulario
      setNewEvent({ date: '', name: '', description: '', color: '#00bcd4' });
      alert('¡Evento personalizado añadido!');
    } else {
      alert('Por favor, completa la fecha y el nombre del evento.');
    }
  };

  // Estadísticas de eventos
  const eventStats = useMemo(() => {
    const stats = {
      total: Object.keys(EVENTS_2025).length,
      special: 0,
      religious: 0,
      cultural: 0,
      season: 0,
      earth: 0,
      space: 0,
      work: 0,
      highImportance: 0,
      mediumImportance: 0,
      lowImportance: 0
    }

    Object.values(EVENTS_2025).forEach(event => {
      stats[event.type]++
      stats[event.importance + 'Importance']++
    })

    return stats
  }, [])

  // Próximos eventos
  const upcomingEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalizar a la medianoche para una comparación justa

    const upcoming = Object.entries(EVENTS_2025)
      .map(([dateString, event]) => {
        // Corregir el problema de la zona horaria creando la fecha en UTC
        const eventDate = new Date(`${dateString}T00:00:00Z`)
        return { date: eventDate, ...event }
      })
      .filter(({ date }) => date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)

    return upcoming
  }, [])

  return (
    <div className="calendar-ui">
      <div className="ui-header">
        <h2>🇨🇴 Calendario Colombia 2025</h2>
        <div className="subtitle">
          Explora los días festivos y eventos de Colombia en 3D
        </div>
      </div>

      {/* Selector de meses simplificado */}
      <div className="controls-section">
        <h3>Seleccionar Mes</h3>
        <div className="month-selector">
          <button 
            className={`month-button ${selectedMonth === 'Todos' ? 'active' : ''}`}
            onClick={() => handleMonthSelect('Todos')}
          >
            Todos
          </button>
          {monthsArray.map(month => (
            <button
              key={month.name}
              className={`month-button ${selectedMonth === month.name ? 'active' : ''}`}
              onClick={() => handleMonthSelect(month.name)}
              style={{ borderColor: month.color }}
            >
              {month.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros eliminados para simplificar */}
      
      {/* Información del mes seleccionado */}
      {selectedInfo && (
        <div className="month-info-panel">
          <div className="month-header">
            <h3 style={{ color: selectedInfo.color }}>
              {selectedInfo.name} 2025
            </h3>
            <div className="month-stats">
              <span className="stat">
                {selectedInfo.days} días
              </span>
              <span className="stat">
                {selectedInfo.season}
              </span>
            </div>
          </div>
          
          <div className="month-details">
            <div className="detail-item">
              <strong>Descripción:</strong>
              <p>{selectedInfo.description}</p>
            </div>
            
            <div className="detail-item">
              <strong>Clima:</strong>
              <p>{selectedInfo.weather}</p>
            </div>
            
            <div className="detail-item">
              <strong>Eventos principales:</strong>
              <p>{selectedInfo.events}</p>
            </div>
          </div>

          <div 
            className="month-color-bar" 
            style={{ backgroundColor: selectedInfo.color }}
          />
        </div>
      )}

      {/* Próximos eventos */}
      <div className="upcoming-events">
        <h3>Próximos Eventos</h3>
        <div className="events-list">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="event-item">
              <div 
                className="event-indicator"
                style={{ backgroundColor: EVENT_TYPES[event.type]?.color }}
              />
              <div className="event-content">
                <div className="event-name">{event.name}</div>
                <div className="event-date">
                  {event.date.toLocaleDateString('es-CO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    timeZone: 'UTC' // Forzar UTC para evitar el desfase
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-section">
        <h3>Estadísticas del Año</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{eventStats.total}</div>
            <div className="stat-label">Eventos Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{eventStats.special}</div>
            <div className="stat-label">Días Festivos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{eventStats.religious}</div>
            <div className="stat-label">Eventos Religiosos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{eventStats.cultural}</div>
            <div className="stat-label">Eventos Culturales</div>
          </div>
        </div>
      </div>

      {/* Leyenda visual mejorada */}
      <div className="legend-section">
        <h3>🎨 Leyenda Visual</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffd700' }} />
            <span>Días con eventos especiales</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#cccccc' }} />
            <span>Días normales</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#95a5a6' }} />
            <span>Fines de semana</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4fd1c7' }} />
            <span>Órbitas mensuales</span>
          </div>
        </div>
      </div>

      {/* Instrucciones mejoradas */}
      <div className="instructions-section">
        <h3>🎮 Cómo Usar</h3>
        <div className="instructions-grid">
          <div className="instruction-item">
            <span className="instruction-icon">🖱️</span>
            <div>
              <strong>Navegación 3D:</strong>
              <p>Arrastra para orbitar, scroll para zoom, clic derecho para mover</p>
            </div>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">👆</span>
            <div>
              <strong>Interacción:</strong>
              <p>Haz clic en los días para ver eventos y detalles</p>
            </div>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">🎛️</span>
            <div>
              <strong>Controles:</strong>
              <p>Usa el panel Leva para personalizar la experiencia</p>
            </div>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">📱</span>
            <div>
              <strong>Filtros:</strong>
              <p>Selecciona meses y tipos de eventos para enfocar tu exploración</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección para añadir eventos personalizados (Acordeón) */}
      <div className="custom-event-section">
        <h3 onClick={() => setIsAddEventVisible(!isAddEventVisible)} className="accordion-header">
          ✨ Añadir Evento Personalizado
          <span className={`accordion-icon ${isAddEventVisible ? 'open' : ''}`}>›</span>
        </h3>
        {isAddEventVisible && (
          <form onSubmit={handleAddEvent} className="custom-event-form">
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleNewEventChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Nombre del evento"
              value={newEvent.name}
              onChange={handleNewEventChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción (opcional)"
              value={newEvent.description}
              onChange={handleNewEventChange}
            />
            <div className="color-picker">
              <label htmlFor="color">Color del evento:</label>
              <input
                type="color"
                id="color"
                name="color"
                value={newEvent.color}
                onChange={handleNewEventChange}
              />
            </div>
            <button type="submit" className="add-event-btn">
              Añadir Evento
            </button>
          </form>
        )}
      </div>

      {/* Información adicional */}
      <div className="footer-info">
        <div className="made-with">
          <p>🚀 Desarrollado con React, Three.js y creatividad</p>
          <p>🇨🇴 Datos oficiales de Colombia 2025</p>
        </div>
      </div>
    </div>
  )
}

export default CalendarUI 