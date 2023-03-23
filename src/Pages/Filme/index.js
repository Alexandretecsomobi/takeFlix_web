import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import './filme.css'
import api from '../../services/api';
import { toast } from 'react-toastify'

function Series() {
    const { idfilme } = useParams();
    const [filme, setFilme] = useState([]);
    const [diretores, setDiretores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFilme() {
            await api.get(`/movie/${idfilme}`, {

            })
                .then((response) => {
                    setFilme([response.data]);
                    //setDiretores(response.data.created_by)
                    setLoading(false);
                    //console.log(response.data)
                })
                .catch(() => {
                    console.log("FILME NAO ENCONTRADO")
                })
        }

        loadFilme();

        //console.log(diretores.map(item => item.name))

        return () => {
            console.log("COMPONENTE FOI DESMONTADO")
        }
    }, [filme])

    if (loading) {
        return (
            <div className="filme-info">
                <h1>Carregando detalhes...</h1>
            </div>
        )
    }

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix");

        let filmesSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmesSalvos.some((filmesSalvo) => filmesSalvo.id === filme.id)

        if (hasFilme) {
            toast.error('Esse filme ja está na lista')
            return;
        }

        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success('Filme salvo com sucesso!')

    }


    return (
        <div className="filme-info">
            {filme.map(item => {
                return (
                    <>
                        <img className='background' src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={item.title} />

                        <div className='box-info-filme'>
                            <img className='poster' src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} alt={item.title} />

                            <div className='info-text'>
                                <h3>Sinopse</h3>
                                <span>{item.overview}</span>

                                <strong>Avalição: {item.vote_average} / 10</strong><br></br>

                                <div className='btn-area'>
                                    <button className='Salvar' onClick={salvarFilme}>Salvar</button>
                                    <a target="blank" rel='external' href={`https://youtube.com/results?search_query=${item.title} filme trailer`} className='trailer'>Trailer</a>
                                </div>
                            </div>
                        </div></>
                )
            })}

        </div>
    )
}

export default Series;