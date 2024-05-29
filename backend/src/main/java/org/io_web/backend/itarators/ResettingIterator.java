package org.io_web.backend.itarators;

import java.util.Iterator;
import java.util.List;

public class ResettingIterator<E> implements Iterator<E> {
    private final List<E> list;
    private Iterator<E> iterator;

    public ResettingIterator(List<E> list) {
        this.list = list;
        this.iterator = list.iterator();
    }

    @Override
    public boolean hasNext() {
        if (!iterator.hasNext()) {
            iterator = list.iterator();
        }
        return iterator.hasNext();
    }

    @Override
    public E next() {
        return iterator.next();
    }
}
