import react, { useEffect, useState } from "react";
import "./style.css";
import api from "../../services/api";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";

export default function Filmes() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [generes, setGeneres] = useState([]);
  const [nomefilme, setNomefilme] = useState("");
  const [totalPage, setTotalPage] = useState();

  const { number } = useParams();

  useEffect(() => {
    async function loadFilmes() {
      await api.get(`/movie/popular?page=${number}`).then((value) => {
        setData(value.data.results);
        setTotalPage(value.data.total_pages);
      });
    }

    console.log(data);
    loadFilmes();
  }, []);

  useEffect(() => {
    api
      .get("/genre/movie/list")
      .then((value) => {
        //console.log(value);
        setGeneres(value.data.genres);
        console.log(generes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="containerPageFilmes">
      <Header></Header>
      <div className="boxCategorias">
        <input
          type="search"
          placeholder="Nome do filme"

          onChange={(e) => {
            setNomefilme(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            if (!nomefilme) {
              return;
            }
            window.location.href = `/filmes/${nomefilme}/page/${1}`;
            setNomefilme("");
          }}
        >
          Pesquisar
        </button>
        <select
          onChange={async (value) => {
            window.location.href = `/filmes/genero/${value.target.value}/page/${1}`;
          }}
        >
          <option>Generos</option>
          {generes.map((item) => {
            return (
              <>
                <option value={item.id}>{item.name}</option>
              </>
            );
          })}
        </select>
      </div>
      <section className="containerListFilms">
   
        <div className="boxListfilmesFilmes">
          {data.map((item) => {
            return (
              <div key={item.id}>
                <div className="item-filme">
                  <img
                    onClick={() => (window.location.href = `/filme/${item.id}`)}
                    src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                  ></img>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="boxBtnNextPage">
        {totalPage !== number && number > 1 && (
          <button
            id="btnNextPage"
            onClick={() => {
              if (totalPage == 1) {
                return;
              }

              window.location.href = `/filmes/page/${Number(number) - 1}`;
            }}
          >
            Voltar para a pagina {Number(number - 1)}
          </button>
        )}
        <button
          id="btnNextPage"
          onClick={() => {
            if (totalPage <= 1) {
              return;
            }
            if (number == totalPage) {
              return;
            }
            window.location.href = `/filmes/page/${Number(number) + 1}`;
          }}
        >
          {totalPage > 1 && totalPage > number ? "Próxima página " : ""}
          {totalPage > 1 && totalPage > number && Number(number) + 1} total - {totalPage}
        </button>
      </div>{" "}
    </div>
  );
}
