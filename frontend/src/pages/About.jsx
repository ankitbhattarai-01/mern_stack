const About = () => {
  return (
    <article className="details-card about">
      <h2>About ExpiryAlert</h2>
      <p>
        ExpiryAlert helps you keep track of food, medicine, cosmetics and
        household items, so products are used before they expire.
      </p>

      <h3>How expiry status works</h3>
      <ul>
        <li>
          <strong>Expired:</strong> the expiry date is before today.
        </li>
        <li>
          <strong>Expiring Soon:</strong> the product expires today or within
          the next 7 days.
        </li>
        <li>
          <strong>Safe:</strong> more than 7 days remain.
        </li>
      </ul>

      <h3>Built with</h3>
      <p>MongoDB, Express.js, React and Node.js.</p>
    </article>
  )
}

export default About
