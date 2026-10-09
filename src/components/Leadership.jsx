/** Leadership: the name set large in Fraunces italic, the client's paragraph verbatim. */
export default function Leadership() {
  return (
    <section className="lead wrap" id="leadership" aria-labelledby="lead-title">
      <div className="lead__aside rv">
        <p className="label">
          <span className="label__num">06</span>Who leads Ajeebas
        </p>
        <h2 className="lead__title display" id="lead-title">
          Leadership
        </h2>
      </div>
      <div className="lead__body rv">
        <p className="lead__name serif-i" aria-hidden="true">
          Jamal Abdul Nazar
        </p>
        <p className="lead__role label" aria-hidden="true">
          Chief Executive Officer
        </p>
        <p className="lead__text">Ajeebas Chocolate is led by Jamal Abdul Nazar, Chief Executive Officer. Jamal is also CEO of Al Mindasah General Trading, a UAE food distribution business. That experience in getting good food onto shelves is what shapes how we build Ajeebas: with the retailer and the customer in mind from day one.</p>
      </div>
    </section>
  )
}
