import * as u from 'neoui-sparrow';
import * as neoui from 'neoui';
import {DataTable, u as kero} from 'kero';
import * as adapter from 'kero-adapter';

u.extend(u, neoui);
u.extend(u, kero);
u.extend(u, adapter);

export {
	u,
	DataTable
};
