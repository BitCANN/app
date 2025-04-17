import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { createManager, ManagerConfig } from 'bitcann';
import { useElectrum } from './hooks/useElectrum';
import { domainTokenCategory, minStartingBid, minBidIncreasePercentage, inactivityExpiryTime, minWaitTime, maxPlatformFeePercentage } from './config';

export const App = () => {
	const [searchDomain, setSearchDomain] = useState('');
	const [searchResult, setSearchResult] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { getClient } = useElectrum();
	const [bitcannClient, setBitcannClient] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() =>{
    const connect = async () => {
      const client = await getClient()
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClient(client);

      const options: ManagerConfig = {
				category: domainTokenCategory,
				minStartingBid: minStartingBid,
				minBidIncreasePercentage: minBidIncreasePercentage,
				inactivityExpiryTime: inactivityExpiryTime,
				minWaitTime: minWaitTime,
				maxPlatformFeePercentage: maxPlatformFeePercentage,
				networkProvider: client
			};
			setBitcannClient(createManager(options));
    }
    connect()
  })

	const handleSearch = async () => {
		if (!searchDomain.trim()) {
			setError('Please enter a domain to search');
			return;
		}

		if (!bitcannClient) {
			setError('BitCANN client not initialized');
			return;
		}

		setIsLoading(true);
		setError(null);
		setSearchResult(null);

		try {
			console.log('searchDomain', searchDomain);

      const lutxos = await client.getUtxos('bitcoincash:qznn6uyfuj9t7da5mv2ul66t63tmtgggruzlpen6ql');
			console.log('utxos', lutxos);

      const auction = await bitcannClient.createAuctionTransaction({
        name: 'a', 
        amount: 10000,
        address: 'bitcoincash:qznn6uyfuj9t7da5mv2ul66t63tmtgggruzlpen6ql'
      });

      console.log('auction', auction);

			const result = await bitcannClient.getDomain(searchDomain);
			console.log('Domain Address:', result.address);
			console.log('Domain Contract:', result.contract);

			const utxos = await client.getUtxos(result.address);
			console.log('utxos', utxos);
			
			setSearchResult(JSON.stringify({ ...result }, null, 2));
		} catch (error) {
			setError(error instanceof Error ? error.message : 'An error occurred while searching');
			console.error('Error searching domain:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ pt: 6 }}>
			{/* Options Display */}
			<Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(71, 73, 77, 0.5)', color: 'white' }}>
				<Typography variant="h6" gutterBottom>Configuration</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Typography>Min Starting Bid: {minStartingBid}</Typography>
						<Typography>Min Bid Increase: {minBidIncreasePercentage}%</Typography>
						<Typography>Inactivity Expiry Time: {inactivityExpiryTime}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography>Min Wait Time: {minWaitTime}</Typography>
						<Typography>Max Platform Fee: {maxPlatformFeePercentage}%</Typography>
						<Typography>Token Category: {domainTokenCategory.substring(0, 30)}...</Typography>
					</Grid>
				</Grid>
			</Paper>

			{/* Search Bar */}
			<Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Enter domain to search"
					value={searchDomain}
					onChange={(e) => setSearchDomain(e.target.value)}
					sx={{ 
						bgcolor: 'rgba(71, 73, 77, 0.5)',
						input: { color: 'white' },
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								borderColor: 'rgba(255, 255, 255, 0.2)',
							},
						},
					}}
				/>
				<Button 
					variant="contained" 
					onClick={handleSearch}
					disabled={isLoading}
					sx={{ minWidth: '120px' }}
				>
					{isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
				</Button>
			</Box>

			{/* Search Results */}
			<Box sx={{ mt: 2 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)' }}>
						{error}
					</Alert>
				)}
				
				{isLoading ? (
					<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
						<CircularProgress />
					</Box>
				) : searchResult && (
					<Paper sx={{ 
						p: 3, 
						bgcolor: 'rgba(71, 73, 77, 0.5)', 
						color: 'white',
						maxHeight: '400px',
						overflow: 'auto'
					}}>
						<Typography variant="h6" gutterBottom>Domain Information</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="subtitle2" color="grey.400">Domain Name:</Typography>
								<Typography mb={2}>{searchResult.name || searchDomain}</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle2" color="grey.400">Full Response:</Typography>
								<Box component="pre" sx={{ 
									overflow: 'auto',
									bgcolor: 'rgba(0, 0, 0, 0.2)',
									p: 2,
									borderRadius: 1,
									'&::-webkit-scrollbar': {
										width: '8px',
										height: '8px',
									},
									'&::-webkit-scrollbar-thumb': {
										backgroundColor: 'rgba(255, 255, 255, 0.2)',
										borderRadius: '4px',
									},
								}}>
									{JSON.stringify(searchResult, null, 2)}
								</Box>
							</Grid>
						</Grid>
					</Paper>
				)}
			</Box>
		</Container>
	);
};

export default App;
