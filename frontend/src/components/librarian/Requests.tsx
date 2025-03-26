
interface Props {
    
}

function Requests({}: Props) {
    return (
        <>
            <div className="content-section mx-auto p-4">
                <h2 className="mt-2 text-3xl">Pending Requests</h2>
                <h4 className="text-xl mt-1">There are no Pending Requests.</h4>
                <h2 className="mt-5 text-3xl">Currently Issued Books</h2>
                <h4 className="text-xl mt-1 mb-4">There are no Issued books.</h4>
            </div>
        </>
    );
}

export default Requests;