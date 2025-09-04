
function Tooltip({ tooltipDta }: any) {

    if(!tooltipDta) return;

    return (
        <div
            className="fixed z-50 px-2 py-2 text-xs text-white bg-gray-500 hidden border-4 border-solid border-blue-500 rounded-md pointer-events-none"
            style={{
                left: tooltipDta.x,
                top: tooltipDta.y,
                transform: "translate(-50%, -100%)",
            }}
        >
            {tooltipDta.text}
        </div>
    )
}

export default Tooltip