import { EOrdersState } from '@shared/enum/orders.enum';
import { ESession } from '@shared/enum/appointment-schedule.enum';

import { config } from '@core/config';
import * as T from '@elastic/elasticsearch/lib/api/types';
import * as TB from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { IndicesIndexSettings } from '@elastic/elasticsearch/lib/api/types';

export const OrderDtoEXConstant = {
  id: 1,
  codeOrders: '',
  phone: '',
  companyName: '',
  regionName: '',
  branchName: '',
  serviceName: '',
  province: '',
  district: '',
  ward: '',
  customerName: '',
  consultantsName: '',
  introducerName: '',
  technicalExpertsName: '',
  appointmentTime: '',
  startTime: '',
  endTime: '',
  session: ESession.AllDay,
  receiveApplicationTime: '',
  completionTime: '',
  state: EOrdersState.Active,
  createdAt: '',
};

export const SettingIndexConstant: IndicesIndexSettings = {
  analysis: {
    analyzer: {
      index_phone_analyzer: {
        type: 'custom',
        char_filter: ['digit_only'],
        tokenizer: 'digit_edge_ngram_tokenizer',
        filter: ['trim'],
      },
      search_phone_analyzer: {
        type: 'custom',
        char_filter: ['digit_only'],
        tokenizer: 'keyword',
        filter: ['trim'],
      },
      index_email_analyzer: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'name_ngram_filter', 'trim'],
      },
      search_email_analyzer: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'trim'],
      },
    },
    char_filter: {
      digit_only: {
        type: 'pattern_replace',
        pattern: '\\D+',
        replacement: '',
      },
    },
    tokenizer: {
      digit_edge_ngram_tokenizer: {
        type: 'edge_ngram',
        min_gram: 1,
        max_gram: 2,
        token_chars: ['digit'],
      },
    },
    filter: {
      name_ngram_filter: {
        type: 'ngram',
        min_gram: 1,
        max_gram: 2,
      },
    },
  },
};

export const IndexOrderConstant: T.IndicesCreateRequest | TB.IndicesCreateRequest = {
  index: config.ELASTICSEARCH_INDEX,
  // settings: SettingIndexConstant,
  mappings: {
    properties: {
      id: {
        type: 'integer',
      },
      customerName: {
        type: 'text',
      },
      phone: {
        type: 'text',
      },
      province: {
        type: 'text',
      },
      district: {
        type: 'text',
      },
      ward: {
        type: 'text',
      },
      companyName: {
        type: 'text',
      },
      codeOrders: {
        type: 'text',
      },
      regionName: {
        type: 'text',
      },
      branchName: {
        type: 'text',
      },
      serviceName: {
        type: 'text',
      },
      consultantsName: {
        type: 'text',
      },
      introducerName: {
        type: 'text',
      },
      technicalExpertsName: {
        type: 'text',
      },
      state: {
        type: 'integer',
      },
      appointmentTime: {
        type: 'date',
      },
      startTime: {
        type: 'date',
      },
      endTime: {
        type: 'date',
      },
      session: {
        type: 'integer',
      },
      receiveApplicationTime: {
        type: 'date',
      },
      completionTime: {
        type: 'date',
      },
      createdAt: {
        type: 'date',
      },
    },
  },
};
