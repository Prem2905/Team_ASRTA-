export default function Footer() {
  return (
    <footer className="saathi-footer">
      <div className="container footer-inner">
        <div>
          <h3>Dastavez Saarthi</h3>

          <p>
            A citizen-first AI guide for discovering government services,
            preparing documents and tracking applications.
          </p>
        </div>

        <div>
          <b>Citizen</b>

          <p>Services & schemes</p>

          <p>My applications</p>

          <p>Talk to Saarthi</p>
        </div>

        <div>
          <b>Trust</b>

          <p>Audit trail</p>

          <p>Human verification</p>

          <p>Secure document handling</p>
        </div>
      </div>

      <div className="footer-bottom">
        Demo civic-tech platform • Government actions are simulated unless
        connected to an official department API.
      </div>
    </footer>
  );
}
