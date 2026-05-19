
function TimeSlots({ hours, selectedBranch, selectedBarber, selectedDay, onSelectHour }) {
    const mapedHours = hours.map((hour) => {
        return (
            <button key={hour.id} onClick={() => onSelectHour(hour.id)}>
        {hour.time}
      </button>
        );
    })

    return ( <div>
        {mapedHours}
    </div>
    )
}

export default TimeSlots;
