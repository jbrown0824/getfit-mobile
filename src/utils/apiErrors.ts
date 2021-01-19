/**
 * Return form errors if they exist, or fallback to getErrorMessage if no form errors can be found
 *
 * @param error
 * @return {Object}
 */
import { AxiosError } from 'axios';

export function getErrorMessage(error: AxiosError): string {
	if (typeof error.response === 'undefined') {
		return error.message;
	}

	const response = error.response;
	const data = response.data;

	if (response.status >= 500) {
		return 'Sorry! An internal error has occurred';
	}

	// Check for form validation errors
	if (data.hasOwnProperty('errors')) {
		const error = data.errors[ Object.keys(data.errors)[ 0 ] ];
		if (typeof error === 'string' ) {
			return error;
		}

		return error[ 0 ];
	}

	if (typeof data === 'object') {
		return data[ Object.keys(data)[ 0 ] ];
	}

	if (data.hasOwnProperty('message') && data.message.length > 0) {
		return data.message;
	}

	if (response.data === 404) {
		return 'Not Found';
	}

	if (typeof data === 'string') {
		return data;
	}

	return 'Sorry! An unknown error has occurred';
}

export function getFormErrors(error: AxiosError) {
	if (error.response && error.response.data && error.response.data.errors) {
		return error.response.data.errors;
	}

	return { error: getErrorMessage(error) };
}
