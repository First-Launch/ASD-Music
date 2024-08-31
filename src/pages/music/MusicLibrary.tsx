import React, { useEffect, useState, useRef } from "react";
import {
  Container, Grid, Card, CardContent, CardMedia, Typography, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, MenuItem, FormControl, Select, InputLabel, SelectChangeEvent,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Headset, Edit, Add, QrCodeScanner } from "@mui/icons-material";
import PageLayout from "../../components/templates/PageLayout";
import Scanner from "../../components/Scanner";
import { MusicDocument } from "../../utils/databaseModels";
import { Result } from "react-zxing";
import { Exception } from "@zxing/library";

const MusicLibraryPage: React.FC = () => {
  const [musicDocs, setMusicDocs] = useState<MusicDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<MusicDocument[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicDocument | null>(null);
  const [playingMusic, setPlayingMusic] = useState<MusicDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [scannerModel, setScannerModel] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [newSong, setNewSong] = useState<MusicDocument>({
    id: '',
    title: '',
    composer: '',
    arranger: '',
    description: '',
    notes: '',
    audioUrl: '',
    coverImageUrl: '',
    gradeLow: '',
    gradeHigh: '',
    type: 'Band',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchMusicDocs = async () => {
      const musicCollection = collection(firestore, "music");
      const musicSnapshot = await getDocs(musicCollection);
      const musicList = musicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MusicDocument[];
      setMusicDocs(musicList);
      setFilteredDocs(musicList);
    };

    fetchMusicDocs().catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = musicDocs.filter((doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.composer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.arranger?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.gradeLow?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.gradeHigh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDocs(filtered);
  }, [searchQuery, musicDocs]);

  const handleRowClick = (music: MusicDocument) => {
    setSelectedMusic(music);
  };

  const handleListenClick = (music: MusicDocument) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingMusic(music);
  };

  useEffect(() => {
    if (audioRef.current && playingMusic && playingMusic.audioUrl) {
      audioRef.current.src = playingMusic.audioUrl;
      audioRef.current.play();
    }
  }, [playingMusic]);

  const handleOpen = (musicDoc?: MusicDocument) => {
    if (musicDoc) {
      setIsEditing(true);
      setNewSong(musicDoc);
    } else {
      setIsEditing(false);
      setNewSong({
        id: '',
        title: '',
        composer: '',
        arranger: '',
        description: '',
        notes: '',
        audioUrl: '',
        coverImageUrl: '',
        gradeLow: '',
        gradeHigh: '',
        type: 'Band',
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (event: SelectChangeEvent) => {
    setNewSong((prev) => ({ ...prev, type: event.target.value }));
  }

  const handleSaveSong = async () => {
    try {
      if (isEditing && newSong.id) {
        const { id, ...songData } = newSong;
        const songDocRef = doc(firestore, "music", newSong.id);
        await updateDoc(songDocRef, songData);
      } else {
        await addDoc(collection(firestore, "music"), newSong);
      }
      const musicCollection = collection(firestore, "music");
      const musicSnapshot = await getDocs(musicCollection);
      const musicList = musicSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MusicDocument[];
      setMusicDocs(musicList);
      setFilteredDocs(musicList);
    } catch (error) {
      console.error("Error saving document: ", error);
    }
    handleClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openScanner = () => {
    setScannerModel(true);
  }

  const closeScanner = () => {
    setScannerModel(false);
  }

  const onScan = (result: Result) => {
    setSearchQuery(result.getText());
    closeScanner();
  }

  const onScanDecodeError = (error: Exception) => {
    console.error(error.message);
  }

  const onScanError = (error: unknown) => {
    console.error(error);
  }
  return (
    <PageLayout title="Music" showTitleBar={true}
      actions={[
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          sx={{ color: "inherit" }}
        >
          <Add />
        </IconButton>,
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openScanner();
          }}
          sx={{ color: "inherit" }}
        >
          <QrCodeScanner />
        </IconButton>
      ]}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Search Bar and Add Song Button */}
          <Grid gap={2} item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Search Music"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {!isMobile && (
              <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add New Song
              </Button>
            )}
          </Grid>

          {/* Music Table */}
          <Grid item xs={12} md={selectedMusic ? 8 : 12}>
            <TableContainer component={Paper} sx={{ mb: (isMobile && playingMusic) ? 15 : 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Composer</TableCell>
                    <TableCell>Arranger</TableCell>
                    <TableCell>Grades</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((music) => (
                    <TableRow
                      key={music.id}
                      hover
                      onClick={() => handleRowClick(music)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{music.title}</TableCell>
                      <TableCell>{music.composer}</TableCell>
                      <TableCell>{music.arranger}</TableCell>
                      <TableCell>
                        {music.gradeLow && music.gradeHigh
                          ? `${music.gradeLow} - ${music.gradeHigh}`
                          : music.gradeLow || music.gradeHigh}
                      </TableCell>
                      <TableCell>{music.type}</TableCell>
                      <TableCell>
                        {music.audioUrl && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleListenClick(music);
                            }}
                          >
                            <Headset />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(music);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDocs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Grid>

          {/* Info Card */}
          {selectedMusic && !isMobile && (
            <Grid item xs={12} md={4}>
              <Card>
                {selectedMusic.coverImageUrl && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={selectedMusic.coverImageUrl}
                    alt={selectedMusic.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h5">{selectedMusic.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {selectedMusic.composer} {selectedMusic.arranger && `arr. ${selectedMusic.arranger}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                    Grades: {selectedMusic.gradeLow} - {selectedMusic.gradeHigh}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedMusic.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleListenClick(selectedMusic)}
                    >
                      <Headset />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

        </Grid>

        {/* Floating Audio Player */}
        {playingMusic && (
          <Box
            sx={{
              position: 'fixed',
              bottom: isMobile ? 'calc(70px + env(safe-area-inset-bottom))' : 0,
              left: 0,
              right: 0,
              bgcolor: 'background.paper',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 3,
            }}
          >
            {isMobile ? (
              <Box>
                <Typography variant="h6">{playingMusic.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {playingMusic.composer} {playingMusic.arranger && `arr. ${playingMusic.arranger}`}
                </Typography>
                <audio ref={audioRef} controls style={{ width: '100%' }}>
                  <source src={playingMusic.audioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            ) : (
              <>
                <Box>
                  <Typography variant="h6">{playingMusic.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {playingMusic.composer} {playingMusic.arranger && `arr. ${playingMusic.arranger}`}
                  </Typography>
                </Box>
                <audio ref={audioRef} controls style={{ width: '300px' }}>
                  <source src={playingMusic.audioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </>
            )}
          </Box>

        )}

        {/* Add/Edit Song Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Edit Song' : 'Add New Song'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              name="title"
              fullWidth
              value={newSong.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Composer"
              name="composer"
              fullWidth
              value={newSong.composer}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Arranger"
              name="arranger"
              fullWidth
              value={newSong.arranger}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={newSong.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Grade Low"
              name="gradeLow"
              fullWidth
              value={newSong.gradeLow}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Grade High"
              name="gradeHigh"
              fullWidth
              value={newSong.gradeHigh}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Audio URL"
              name="audioUrl"
              fullWidth
              value={newSong.audioUrl}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Cover Image URL"
              name="coverImageUrl"
              fullWidth
              value={newSong.coverImageUrl}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-select">Type</InputLabel>
              <Select
                labelId="type-select"
                label="Type"
                name="type"
                value={newSong.type}
                onChange={handleTypeSelect}
              >
                <MenuItem value="Band">Band</MenuItem>
                <MenuItem value="Choir">Choir</MenuItem>
                <MenuItem value="Keyboard">Keyboard</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveSong} color="primary">
              {isEditing ? 'Save Changes' : 'Add Song'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Scanner Modal */}
        <Dialog open={scannerModel} onClose={() => setScannerModel(false)}>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogContent>
            <Scanner onDecodeResult={onScan} onDecodeError={onScanDecodeError} onError={onScanError} />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeScanner} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mobile song dialog */}
        {isMobile && selectedMusic && (
          <Dialog open={!!selectedMusic} onClose={() => setSelectedMusic(null)}>
            <DialogTitle>{selectedMusic.title}</DialogTitle>
            <DialogContent>
              {/* Image */}
              {selectedMusic.coverImageUrl && (
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedMusic.coverImageUrl}
                  alt={selectedMusic.title}
                />
              )}
              <Typography variant="subtitle1" color="textSecondary">
                {selectedMusic.composer} {selectedMusic.arranger && `arr. ${selectedMusic.arranger}`}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
                Grades: {selectedMusic.gradeLow} - {selectedMusic.gradeHigh}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {selectedMusic.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  color="primary"
                  onClick={() => handleListenClick(selectedMusic)}
                >
                  <Headset />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleOpen(selectedMusic)} color="primary">
                Edit
              </Button>
              <Button onClick={() => setSelectedMusic(null)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </PageLayout>
  );
};

export default MusicLibraryPage;
