import "../css/table.css"

function Table({ candidatesData, onTableRowClick }) {
    return (
        <div className='table'>
            <div id='tableTitle'>
                <div id='title-1'>Name</div>
                <div id='title-2'>Department</div>
                <div id='title-3'>Application Number</div>
            </div>
            {
                candidatesData.map((item, index) => (
                    <div className='rows' key={index} onClick={() => onTableRowClick(item.email, item.questionMarksId)}>
                        <div className='col-1'>{item.name}</div>
                        <div className='col-2'>{item.department}</div>
                        <div className='col-3'>{item.applicationNumber}</div>
                    </div>
                ))
            }
        </div>
    );
}

export default Table;