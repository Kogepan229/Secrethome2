package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"secrethome-back/video"
	"strconv"
)

func main() {
	fmt.Printf("hello")

	http.Handle("/video/upload/start", CORSMiddleware(http.HandlerFunc(startUploadVideo)))
	http.Handle("/video/upload/chunk", CORSMiddleware(http.HandlerFunc(uploadVideoChunk)))

	go video.StartWorker()

	http.ListenAndServe(":20080", nil)
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

var DATA_DIR string = "../data"

func startUploadVideo(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	totalChunk, err := strconv.Atoi(r.FormValue("totalChunk"))
	hash := r.FormValue("fileHash")

	if id == "" || err != nil || totalChunk <= 0 || hash == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	video.AddUploadInfo(id, totalChunk, hash)

	w.WriteHeader(http.StatusOK)
}

func uploadVideoChunk(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	index, err := strconv.Atoi(r.FormValue("index"))

	if id == "" || err != nil || index < 0 {
		http.Error(w, "Invalid index or id", http.StatusBadRequest)
		return
	}

	if !video.ExistInMap(id) {
		http.Error(w, "Start upload video before upload chunk", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("chunk")
	if err != nil {
		http.Error(w, "Invalid chunk", http.StatusBadRequest)
		return
	}

	chunkDir := filepath.Join(DATA_DIR, "tmp", "video", "chunks", id)
	err = os.MkdirAll(chunkDir, 0644)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	fileOut, err := os.Create(filepath.Join(chunkDir, strconv.Itoa(index)))
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer fileOut.Close()

	_, err = io.Copy(fileOut, file)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if video.IncreaseUploaded(id) {
		// send all chunks
		println("all")
		video.StartProcess(id)
		w.WriteHeader(http.StatusCreated)
		return
	}
	w.WriteHeader(http.StatusOK)
}
