import * as u from 'neoui-sparrow/js/index';
import * as neoui from 'neoui/js/index';
import {DataTable, u as kero} from 'kero/js/index';
import * as adapter from 'kero-adapter/js/index';

u.extend(u, neoui);
u.extend(u, kero);
u.extend(u, adapter);

export {
	u,
	DataTable
};
