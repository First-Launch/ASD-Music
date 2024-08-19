import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Autocomplete,
} from '@mui/material';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase'; // Make sure to update the path
import { Preview, Edit, AssignmentInd } from '@mui/icons-material';

interface InstrumentDocument {
    id?: string;
    assetTag: string;
    brand: string;
    condition: string;
    hasMouthpiece: boolean;
    inForRepair: boolean;
    model: string;
    needsRepair: boolean;
    primaryPhoto: string;
    serial: string;
    status: string;
    type: string;
    checkedOutTo?: string;  // New field to store student information
}

const InstrumentsInventoryPage: React.FC = () => {
    const [instruments, setInstruments] = useState<InstrumentDocument[]>([]);
    const [filteredInstruments, setFilteredInstruments] = useState<InstrumentDocument[]>([]);
    const [selectedInstrument, setSelectedInstrument] = useState<InstrumentDocument | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [studentName, setStudentName] = useState<string>('');
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);

    const [newInstrument, setNewInstrument] = useState<InstrumentDocument>({
        assetTag: '',
        brand: '',
        condition: '',
        hasMouthpiece: false,
        inForRepair: false,
        model: '',
        needsRepair: false,
        primaryPhoto: '',
        serial: '',
        status: '',
        type: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(firestore, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,  // assuming users have a 'name' field
            }));
            setUsers(usersList);
        };

        fetchUsers().catch(console.error);
    }, []);


    useEffect(() => {
        const fetchInstruments = async () => {
            const instrumentsCollection = collection(firestore, 'instruments');
            const instrumentsSnapshot = await getDocs(instrumentsCollection);
            const instrumentsList = instrumentsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as InstrumentDocument[];
            setInstruments(instrumentsList);
            setFilteredInstruments(instrumentsList);
        };

        fetchInstruments().catch(console.error);
    }, []);

    useEffect(() => {
        const filtered = instruments.filter((instrument) =>
            instrument.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instrument.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instrument.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instrument.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instrument.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredInstruments(filtered);
    }, [searchQuery, instruments]);

    const handleRowClick = (instrument: InstrumentDocument) => {
        setSelectedInstrument(instrument);
    };

    const handleOpen = (instrument?: InstrumentDocument) => {
        if (instrument) {
            setIsEditing(true);
            setNewInstrument(instrument);
        } else {
            setIsEditing(false);
            setNewInstrument({
                assetTag: '',
                brand: '',
                condition: '',
                hasMouthpiece: false,
                inForRepair: false,
                model: '',
                needsRepair: false,
                primaryPhoto: '',
                serial: '',
                status: '',
                type: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleCheckoutOpen = (instrument: InstrumentDocument) => {
        setSelectedInstrument(instrument);
        setStudentName(instrument.checkedOutTo || '');
        setCheckoutOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setNewInstrument(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveInstrument = async () => {
        if (!newInstrument.serial.trim() || !newInstrument.type.trim()) {
            alert("Please provide both a serial number and a type.");
            return;
        }

        try {
            if (isEditing && newInstrument.id) {
                const { id, ...instrumentData } = newInstrument; // Exclude the `id` field
                const instrumentDocRef = doc(firestore, 'instruments', newInstrument.id);
                await updateDoc(instrumentDocRef, { ...instrumentData });
            } else {
                await addDoc(collection(firestore, 'instruments'), newInstrument);
            }
            const instrumentsCollection = collection(firestore, 'instruments');
            const instrumentsSnapshot = await getDocs(instrumentsCollection);
            const instrumentsList = instrumentsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as InstrumentDocument[];
            setInstruments(instrumentsList);
            setFilteredInstruments(instrumentsList);
        } catch (error) {
            console.error('Error saving document: ', error);
        }
        handleClose();
    };

    const handleCheckoutSave = async () => {
        if (selectedInstrument && studentName.trim()) {
            try {
                const instrumentDocRef = doc(firestore, 'instruments', selectedInstrument.id!);
                await updateDoc(instrumentDocRef, { checkedOutTo: studentName });
                setSelectedInstrument(null);
                setStudentName('');
                setCheckoutOpen(false);

                // Refresh the instrument list
                const instrumentsCollection = collection(firestore, 'instruments');
                const instrumentsSnapshot = await getDocs(instrumentsCollection);
                const instrumentsList = instrumentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as InstrumentDocument[];
                setInstruments(instrumentsList);
                setFilteredInstruments(instrumentsList);
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        } else {
            alert("Please enter a student's name.");
        }
    };


    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* Search Bar and Add Instrument Button */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        label="Search Instruments"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        Add New Instrument
                    </Button>
                </Grid>

                {/* Instruments Table */}
                <Grid item xs={12} md={selectedInstrument ? 8 : 12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Asset Tag</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Serial</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInstruments.map((instrument) => (
                                    <TableRow
                                        key={instrument.assetTag}
                                        hover
                                        onClick={() => handleRowClick(instrument)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{instrument.assetTag}</TableCell>
                                        <TableCell>{instrument.brand}</TableCell>
                                        <TableCell>{instrument.model}</TableCell>
                                        <TableCell>{instrument.serial}</TableCell>
                                        <TableCell>{instrument.type}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpen(instrument);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckoutOpen(instrument);
                                                }}
                                            >
                                                <AssignmentInd />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(instrument);
                                                }}
                                            >
                                                <Preview />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Instrument Preview */}
                {selectedInstrument && (
                    <Grid item xs={12} md={4}>
                        <Card>
                            {selectedInstrument.primaryPhoto && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={selectedInstrument.primaryPhoto}
                                    alt={`${selectedInstrument.type} - ${selectedInstrument.brand}`}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{selectedInstrument.type}</Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {selectedInstrument.brand} {selectedInstrument.model}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Serial: {selectedInstrument.serial}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Asset Tag: {selectedInstrument.assetTag}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Condition: {selectedInstrument.condition}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Status: {selectedInstrument.status}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedInstrument.checkedOutTo ? `Checked out to: ${selectedInstrument.checkedOutTo}` : "Available"}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedInstrument.hasMouthpiece} disabled />}
                                        label="Has Mouthpiece"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedInstrument.inForRepair} disabled />}
                                        label="In For Repair"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedInstrument.needsRepair} disabled />}
                                        label="Needs Repair"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Add/Edit Instrument Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Edit Instrument' : 'Add New Instrument'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Asset Tag"
                        name="assetTag"
                        fullWidth
                        value={newInstrument.assetTag}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Brand"
                        name="brand"
                        fullWidth
                        value={newInstrument.brand}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Model"
                        name="model"
                        fullWidth
                        value={newInstrument.model}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Serial"
                        name="serial"
                        fullWidth
                        value={newInstrument.serial}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Type"
                        name="type"
                        fullWidth
                        value={newInstrument.type}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Condition"
                        name="condition"
                        fullWidth
                        value={newInstrument.condition}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        name="status"
                        fullWidth
                        value={newInstrument.status}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Primary Photo URL"
                        name="primaryPhoto"
                        fullWidth
                        value={newInstrument.primaryPhoto}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newInstrument.hasMouthpiece}
                                onChange={handleChange}
                                name="hasMouthpiece"
                            />
                        }
                        label="Has Mouthpiece"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newInstrument.inForRepair}
                                onChange={handleChange}
                                name="inForRepair"
                            />
                        }
                        label="In For Repair"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newInstrument.needsRepair}
                                onChange={handleChange}
                                name="needsRepair"
                            />
                        }
                        label="Needs Repair"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveInstrument} color="primary">
                        {isEditing ? 'Save Changes' : 'Add Instrument'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Checkout Instrument Modal */}
            <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)}>
                <DialogTitle>Checkout Instrument to Student</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={users}
                        getOptionLabel={(option) => option.name}
                        value={users.find((user) => user.name === studentName) || null}
                        onChange={(event, newValue) => {
                            setStudentName(newValue ? newValue.name : '');
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Student Name"
                                margin="dense"
                                fullWidth
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCheckoutOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCheckoutSave} color="primary">
                        Checkout
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default InstrumentsInventoryPage;
