import React from 'react'
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

export default function AddNewItemButton() { 
    const { t } = useTranslation();

    return (
        <Button variant="contained" color="primary" style={{backgroundColor: grey[900], color: grey[50], width: '100%', height: '100%', marginBottom: 10}} >
            {t('fieldsActions.addNew')}
        </Button>
    )
}