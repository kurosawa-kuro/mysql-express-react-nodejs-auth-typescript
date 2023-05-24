import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';

test('renders HomeScreen with MERN Authentication h1 header', () => {
    render(
        <Router>
            <HomeScreen />
        </Router>
    );

    const h1Element = screen.getByRole('heading', { name: /MERN Authentication/i, level: 1 });
    expect(h1Element).toBeInTheDocument();
});
