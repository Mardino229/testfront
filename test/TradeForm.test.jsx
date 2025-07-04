import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TradeForm from '@/components/TradeForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { postOrder } from '@/lib/api';

// Mock postOrder
jest.mock('@/lib/api', () => ({
    postOrder: jest.fn(),
}));

// Mock useMutation
jest.mock('@tanstack/react-query', () => {
    const original = jest.requireActual('@tanstack/react-query');
    return {
        ...original,
        useMutation: jest.fn(),
    };
});

describe('TradeForm', () => {
    const queryClient = new QueryClient();
    const setOpen = jest.fn();
    const balance = 1000;

    const renderComponent = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TradeForm balance={balance} setOpen={setOpen} />
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.alert = jest.fn(); // Mock alert
    });

    it('renders correctly', () => {
        renderComponent();
        expect(screen.getByText("Type d'ordre")).toBeInTheDocument();
        expect(screen.getByText("Prix")).toBeInTheDocument();
        expect(screen.getByText("Montant")).toBeInTheDocument();
        expect(screen.getByText("Pass order")).toBeInTheDocument();
    });

    it('shows validation errors when fields are empty', async () => {
        renderComponent();
        fireEvent.click(screen.getByText("Pass order"));
        expect(await screen.findByText("Ce champ est requis")).toBeInTheDocument();
        expect(await screen.findByText("Prix doit être supérieur à 0")).toBeInTheDocument();
        expect(await screen.findByText("Montant doit être supérieur à 0")).toBeInTheDocument();
    });

    it('calculates fees and total correctly', () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText("Prix"), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText("Montant"), { target: { value: '2' } });
        expect(screen.getByText("Frais (0.1%): 0.2000")).toBeInTheDocument();
        expect(screen.getByText("Montant total: 200.2000")).toBeInTheDocument();
    });

    it('submits the form successfully', async () => {
        const mockMutation = jest.fn().mockResolvedValue({ data: 'success' });
        useMutation.mockReturnValue({ mutate: mockMutation, isPending: false, isError: false });

        renderComponent();
        fireEvent.change(screen.getByLabelText("Type d'ordre"), { target: { value: 'bid' } });
        fireEvent.change(screen.getByLabelText("Prix"), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText("Montant"), { target: { value: '2' } });
        fireEvent.click(screen.getByText("Pass order"));

        await waitFor(() => {
            expect(mockMutation).toHaveBeenCalledWith({
                type: 'bid',
                price: 100,
                amount: 2,
            });
            expect(setOpen).toHaveBeenCalledWith(false);
        });
    });

    it('displays error message on submission failure', async () => {
        const mockMutation = jest.fn().mockRejectedValue({ status: 400, response: { data: { error: 'Erreur de soumission' } } });
        useMutation.mockReturnValue({ mutate: mockMutation, isPending: false, isError: true, error: { message: 'Erreur' } });

        renderComponent();
        fireEvent.change(screen.getByLabelText("Type d'ordre"), { target: { value: 'bid' } });
        fireEvent.change(screen.getByLabelText("Prix"), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText("Montant"), { target: { value: '2' } });
        fireEvent.click(screen.getByText("Pass order"));

        await waitFor(() => {
            expect(screen.getByText("Erreur de soumission")).toBeInTheDocument();
        });
    });

    it('displays insufficient balance alert', () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText("Type d'ordre"), { target: { value: 'bid' } });
        fireEvent.change(screen.getByLabelText("Prix"), { target: { value: '1000' } });
        fireEvent.change(screen.getByLabelText("Montant"), { target: { value: '2' } });
        fireEvent.click(screen.getByText("Pass order"));
        expect(global.alert).toHaveBeenCalledWith('Solde insuffisant');
    });
});