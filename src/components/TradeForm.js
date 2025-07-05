
// src/components/TradeForm.js
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {useMutation} from "@tanstack/react-query";
import {postOrder} from "@/lib/api";
import { useQueryClient } from '@tanstack/react-query';

export default function TradeForm({ balance, setOpen }) {
    const queryClient = useQueryClient();
    const [error, setError] = useState("");
    const { register, watch, formState: { errors }, handleSubmit } = useForm();
    const [fees, setFees] = useState(0);
    const [total, setTotal] = useState(0);

    const watchAmount = watch('amount');
    const watchPrice = watch('price');

    useEffect(() => {
        const amountNum = parseFloat(watchAmount) || 0;
        const priceNum = parseFloat(watchPrice) || 0;
        const calculatedFees = amountNum * priceNum * 0.001; // 0.1%
        setFees(calculatedFees);
        setTotal(amountNum * priceNum + calculatedFees);
    }, [watchAmount, watchPrice]);

    const {mutate, isPending, error: err, isError} = useMutation({
        mutationFn: (data)=>postOrder(data),
        onSuccess: data => {
            console.log(data);
            setError("")
            queryClient.invalidateQueries(['rateBtcRate']);
            queryClient.invalidateQueries(['orders']);
            setOpen(false);
        },
        onError: error => {
            if (error.status===400) {
                setError(error.response.data.error);
            } else {
                setError("Une erreur s'est produite. Réessayer")
            }
            console.log(error);
        }
    })

    const onSubmit = data => {
        setError("")
        if (total > balance) {
            setError('Solde insuffisant');
            return;
        }
        mutate(data)
        // Envoyer la requête pour créer l’ordre
        console.log('Ordre soumis:', data);
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="bg-white px-4 pt-5 sm:p-6 ">
                {error && <p className="text-red-600 text-center">{error}</p>}

                <div className="sm:flex sm:items-start">
                    <div className="w-full">
                        <div className="sm:col-span-3">
                            <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                                Type d&apos;ordre
                            </label>
                            <select {...register('type', { required: true })} className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                <option value="">Sélectionnez</option>
                                <option value="bid">Bid</option>
                                <option value="ask">Ask</option>
                            </select>
                            {errors.type && <p className="text-red-600">Ce champ est requis</p>}
                        </div>
                        <div className="flex gap-3 justify-between w-full">
                            <div className="sm:col-span-4 w-full">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                    Prix
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="number"
                                            step="any"
                                            {...register('price', { required: true, min: 0.0001, valueAsNumber: true  })}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-600">Prix doit être supérieur à 0</p>}
                                </div>
                            </div>
                            <div className="sm:col-span-4 w-full">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                    Montant
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="number"
                                            step="any"
                                            {...register('amount', { required: true, min: 0.0001 , valueAsNumber: true })}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                    {errors.amount && <p className="text-red-600">Montant doit être supérieur à 0</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <p>Frais (0.1%): {fees.toFixed(4)}</p>
                    <p>Montant total: {total.toFixed(4)}</p>
                </div>
            </div>
            <p>{isError && error.message}</p>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full justify-center rounded-md cursor-pointer bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                >
                    Pass order
                </button>
                <button
                    type="button"
                    data-autofocus
                    disabled={isPending}
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                    Cancel
                </button>
            </div>
        </form>
        </>
    );
}




