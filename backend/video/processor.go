package video

import (
	"crypto/sha256"
	"encoding/hex"
	"log/slog"
	"os"
	"path/filepath"
	"strconv"
)

type UploadInfo struct {
	totalChunk    int
	uploadedChunk int
	fileHash      string
}

const data_dir string = "../data"

var uploadMap = make(map[string]*UploadInfo)
var channel = make(chan string, 8)

func AddUploadInfo(id string, totalChunk int, fileHash string) {
	info := UploadInfo{totalChunk, 0, fileHash}
	uploadMap[id] = &info
}

func ExistInMap(id string) bool {
	_, exist := uploadMap[id]
	return exist
}

func IncreaseUploaded(id string) bool {
	uploadMap[id].uploadedChunk += 1
	return uploadMap[id].uploadedChunk == uploadMap[id].totalChunk
}

func StartWorker() {
	for {
		id := <-channel
		process(id)
	}
}

func StartProcess(id string) {
	channel <- id
}

func process(id string) {
	println("process", id)
	info, exist := uploadMap[id]
	if !exist {
		return
	}

	videoDir := filepath.Join(data_dir, "tmp", "video")
	chunkDir := filepath.Join(videoDir, "chunks", id)
	mp4Path := filepath.Join(videoDir, id+".mp4")

	mergeSuccess := mergeFile(chunkDir, mp4Path, info.totalChunk)

	err := os.RemoveAll(chunkDir)
	if err != nil {
		slog.Warn("Failed to remove chunk dir", "id", chunkDir)
	}

	if !mergeSuccess {
		return
	}

	if !checkHash(mp4Path, info.fileHash) {
		slog.Error("Hash is not match")
		return
	}

	println("complete")
}

func mergeFile(chunkDirPath string, mp4Path string, totalChunk int) bool {
	fileMP4, err := os.OpenFile(mp4Path, os.O_CREATE|os.O_APPEND|os.O_RDWR, 0644)
	if err != nil {
		slog.Error("Failed to create mp4 file")
		return false
	}
	defer fileMP4.Close()

	for i := range totalChunk {
		fileChunk, err := os.Open(filepath.Join(chunkDirPath, strconv.Itoa(i)))
		if err != nil {
			slog.Error("Failed to open chunk file")
			return false
		}

		_, err = fileChunk.WriteTo(fileMP4)
		if err != nil {
			slog.Error("Failed to write chunk to mp4")
			return false
		}

		fileChunk.Close()
	}

	return true
}

func checkHash(mp4Path string, originalHash string) bool {
	fileMP4, err := os.Open(mp4Path)
	if err != nil {
		slog.Error("Failed to open mp4.", "error", err.Error())
		return false
	}
	defer fileMP4.Close()

	hash := sha256.New()
	_, err = fileMP4.WriteTo(hash)
	if err != nil {
		slog.Error("Failed to calc hash.", "error", err.Error())
		return false
	}

	hashBytes := hash.Sum(nil)
	return hex.EncodeToString(hashBytes) == originalHash
}
