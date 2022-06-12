import "../css/table.css"

function Table({ candidatesData, onTableRowClick }) {
    return (
        <div className='table'>
            <div id='tableTitle'>
                <div id='titleName'>Name</div>
                <div id='titleDepartment'>Department</div>
                <div id='titleApplicationNumber'>Application Number</div>
            </div>
            {
                candidatesData.map((item, index) => (
                    <div className='rows' key={index} onClick={() => onTableRowClick(item.email, item.questionMarksId)}>
                        <div className='name'>{item.name}</div>
                        <div className='department'>{item.department}</div>
                        <div className='applicationNumber'>{item.applicationNumber}</div>
                    </div>
                ))
            }
        </div>
    );
}

export default Table;