import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import { ZoomableGroup } from 'react-simple-maps/zoom'
import SiteHeader from '../components/SiteHeader'
import { travelPlaces, type TravelPlace } from '../data/travel'

const WORLD_CENTER: [number, number] = [0, 15]
const WORLD_ZOOM = 1

type MapView = {
  center: [number, number]
  zoom: number
}

function Travel() {
  const [view, setView] = useState<MapView>({
    center: WORLD_CENTER,
    zoom: WORLD_ZOOM,
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [eventIndex, setEventIndex] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)

  const selectedPlace =
    travelPlaces.find((place) => place.id === selectedId) ?? null

  const selectedEvent = selectedPlace?.events[eventIndex] ?? null
  const photos = selectedEvent?.photos ?? []
  const currentPhoto = photos[photoIndex] ?? null

  const stateBorderOpacity = Math.max(
    0,
    Math.min(0.72, (view.zoom - 3.5) * 0.22),
  )

  function selectPlace(place: TravelPlace) {
    setSelectedId(place.id)
    setEventIndex(0)
    setPhotoIndex(0)

    setView((current) => ({
      center: place.coordinates,
      zoom: Math.max(current.zoom, 3.25),
    }))
  }

  function selectEvent(index: number) {
    setEventIndex(index)
    setPhotoIndex(0)
  }

  function zoomIn() {
    setView((current) => ({
      ...current,
      zoom: Math.min(14, current.zoom * 1.5),
    }))
  }

  function zoomOut() {
    setView((current) => ({
      ...current,
      zoom: Math.max(1, current.zoom / 1.5),
    }))
  }

  function resetMap() {
    setView({
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
    })
  }

  function previousPhoto() {
    if (photos.length === 0) return

    setPhotoIndex((current) =>
      current === 0 ? photos.length - 1 : current - 1,
    )
  }

  function nextPhoto() {
    if (photos.length === 0) return

    setPhotoIndex((current) =>
      current === photos.length - 1 ? 0 : current + 1,
    )
  }

  return (
    <div className="site-shell travel-page">
      <SiteHeader />

      <main className="travel-main">
        <header className="travel-intro">
          <p className="travel-eyebrow">TRAVEL</p>

          <h1>Where mathematics has taken me</h1>

          <p>
            Mathematics has brought me to conferences, workshops, summer
            schools, and talks across the United States and beyond. Click a pin
            to see what brought me there — and, when I have them, a few photos
            from the trip.
          </p>
        </header>

        <section className="travel-stage">
          <div className="travel-map-shell">
            <div className="travel-map-controls" aria-label="Map controls">
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
                title="Zoom in"
              >
                +
              </button>

              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
                title="Zoom out"
              >
                −
              </button>

              <button
                type="button"
                className="travel-reset-map"
                onClick={resetMap}
              >
                Reset
              </button>
            </div>

            <ComposableMap
              width={980}
              height={560}
              projection="geoMercator"
              projectionConfig={{
                scale: 145,
              }}
              className="travel-map"
              aria-label="Interactive map of places mathematics has taken Owen"
            >
              <ZoomableGroup
                center={view.center}
                zoom={view.zoom}
                minZoom={1}
                maxZoom={14}
                onMoveEnd={({ coordinates, zoom }) => {
                  if (
                    !coordinates ||
                    typeof coordinates[0] !== 'number' ||
                    typeof coordinates[1] !== 'number' ||
                    typeof zoom !== 'number'
                  ) {
                    return
                  }

                  setView({
                    center: [coordinates[0], coordinates[1]],
                    zoom,
                  })
                }}
              >
                <Geographies geography="/maps/world.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="travel-geography"
                      />
                    ))
                  }
                </Geographies>

                {view.zoom > 3.5 && (
                  <Geographies geography="/maps/us-canada-admin1.json">
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className="travel-admin-line"
                          opacity={stateBorderOpacity}
                        />
                      ))
                    }
                  </Geographies>
                )}

                {travelPlaces.map((place) => {
                  const selected = place.id === selectedId
                  const markerScale = 1 / view.zoom

                  const markerRegion =
                    place.region === 'USA'
                      ? ''
                      : place.region.endsWith(', USA')
                        ? place.region.replace(', USA', '')
                        : place.region.split(',').at(-1)?.trim() ?? place.region

                  const markerLabel = markerRegion
                    ? `${place.name}, ${markerRegion}`
                    : place.name

                  return (
                    <Marker
                      key={place.id}
                      coordinates={place.coordinates}
                      className={
                        selected
                          ? 'travel-marker travel-marker-selected'
                          : 'travel-marker'
                      }
                      role="button"
                      tabIndex={0}
                      aria-label={`${place.name}, ${place.region}`}
                      onClick={() => selectPlace(place)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          selectPlace(place)
                        }
                      }}
                    >
                      <title>
                        {place.name}, {place.region}
                      </title>

                      <g transform={`scale(${markerScale})`}>
                        <circle
                          className="travel-pin-halo"
                          r={14}
                        />

                        <path
                          className="travel-pin"
                          d="M0,-13 C7.4,-13 11,-8.5 11,-2.2 C11,5.4 0,15 0,15 C0,15 -11,5.4 -11,-2.2 C-11,-8.5 -7.4,-13 0,-13 Z"
                        />

                        <circle
                          className="travel-pin-core"
                          cy={-2.5}
                          r={3.4}
                        />

                        {selected && (
                          <text
                            className="travel-marker-label"
                            textAnchor="middle"
                            y={-21}
                          >
                            {markerLabel}
                          </text>
                        )}
                      </g>
                    </Marker>
                  )
                })}
              </ZoomableGroup>
            </ComposableMap>

            <div className="travel-map-note">
              Drag to move · scroll or pinch to zoom
            </div>
          </div>

          <aside className="travel-detail">
            {!selectedPlace ? (
              <div className="travel-detail-empty">
                <span>EXPLORE THE MAP</span>
                <h2>Choose a pin</h2>
                <p>
                  Each point marks a place connected to a conference,
                  workshop, summer school, talk, or mathematical home.
                </p>
              </div>
            ) : (
              <>
                <div className="travel-detail-heading">
                  <span>MATHEMATICS BROUGHT ME TO</span>
                  <h2>{selectedPlace.name}</h2>
                  <p>{selectedPlace.region}</p>
                </div>

                {selectedPlace.events.length > 1 && (
                  <div
                    className="travel-event-tabs"
                    aria-label={`Trips to ${selectedPlace.name}`}
                  >
                    {selectedPlace.events.map((event, index) => (
                      <button
                        key={`${event.date}-${event.title}`}
                        type="button"
                        className={
                          index === eventIndex
                            ? 'travel-event-tab active'
                            : 'travel-event-tab'
                        }
                        onClick={() => selectEvent(index)}
                      >
                        {event.date}
                      </button>
                    ))}
                  </div>
                )}

                {selectedEvent && (
                  <article className="travel-event">
                    <span className="travel-event-date">
                      {selectedEvent.date}
                    </span>

                    <h3>{selectedEvent.title}</h3>

                    {selectedEvent.detail && (
                      <p>{selectedEvent.detail}</p>
                    )}
                  </article>
                )}

                {currentPhoto && (
                  <div className="travel-carousel">
                    <div className="travel-photo-frame">
                      <img
                        src={currentPhoto.src}
                        alt={currentPhoto.alt}
                      />

                      {currentPhoto.caption && (
                        <div className="travel-photo-caption">
                          {currentPhoto.caption}
                        </div>
                      )}
                    </div>

                    <div className="travel-carousel-controls">
                      <button
                        type="button"
                        onClick={previousPhoto}
                        aria-label="Previous photo"
                      >
                        ←
                      </button>

                      <span>
                        {photoIndex + 1} / {photos.length}
                      </span>

                      <button
                        type="button"
                        onClick={nextPhoto}
                        aria-label="Next photo"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </aside>
        </section>

        <p className="travel-map-credit">
          Map geometry derived from Natural Earth.
        </p>
      </main>
    </div>
  )
}

export default Travel
