import 'bootstrap/dist/css/bootstrap.min.css' 

function Navbar() {
    return (
        <nav className='navbar navbar-dark bg-dark py-3'>
            <div className='container text-center'>
                <a className='navbar-brand fw-bold fs-3'>Barbería Craneo Barbero</a>
                <p className='text-warning mb-0' style={{fontSize: '0.8rem', letterSpacing: '3px'}}>Barbería & Estilo</p>
            </div>
        </nav>
    )
}

export default Navbar
