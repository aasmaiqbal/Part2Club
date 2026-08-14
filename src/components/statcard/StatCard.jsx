import "./StatCard.css";

function StatCard({ title, value, icon, color }) {
  return (
    <div className="statCard">
      <div className="iconBox" style={{ background: color }}>
        {icon}
      </div>

      <div className="cardInfo">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default StatCard;