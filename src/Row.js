import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs based on a specific condition/variable
  // Pull the movies from the API
  useEffect(() => {
    //if [] empty, run oncewhen the row loads and dont run again means run only on page load.

    async function fetchData() {
      const request = await axios.get(fetchUrl);
      //It will be this below Url
      //"https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213",

      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //need to pass fetchUrl in the array bcoz this variable is coming from
    //outside the block. It is not local to async fucntion therefore...
  }, [fetchUrl]);

  console.log(movies);

  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      //https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      // movieTrailer(movie?.name || "")
      movieTrailer(movie?.title || movie?.name || movie?.original_name || " ")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {/* several row posters */}
        {movies.map((movie) => {
          //we are doing string interpolation -javascript feature
          return (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
